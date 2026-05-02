import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/httpCode';
import { donorRepository } from '@/modules/donor/donor.repository';
import { bloodStockService } from '@/modules/bloodStock/bloodStock.service';
import { transactionRepository } from './transaction.repository';
import {
  CreateTransactionInDto,
  CreateTransactionOutDto,
  ITransaction,
  PaginatedTransactionResponse,
  QueryTransactionDto,
  TransactionResponse,
  TransactionStatsResponse,
  TransactionStatus,
  TransactionType,
  UpdateTransactionDto,
} from './transaction.type';

// ── Helper ────────────────────────────────────────────────────────────────────

function formatTransaction(tx: ITransaction): TransactionResponse {
  // Deteksi apakah createdBy sudah ter-populate atau masih ObjectId
  const createdBy =
    typeof tx.createdBy === 'object' && 'username' in tx.createdBy
      ? {
          id: (tx.createdBy as any)._id.toString(),
          username: (tx.createdBy as any).username,
        }
      : tx.createdBy.toString();

  return {
    id: tx._id.toString(),
    type: tx.type,
    donorId: tx.donorId?.toString() ?? null,
    donorName: tx.donorName ?? null,
    bloodType: tx.bloodType,
    rhesus: tx.rhesus,
    bloodLabel: `${tx.bloodType}${tx.rhesus}`,
    component: tx.component,
    quantity: tx.quantity,
    recipientName: tx.recipientName ?? null,
    recipientHospital: tx.recipientHospital ?? null,
    recipientPhone: tx.recipientPhone ?? null,
    notes: tx.notes ?? null,
    status: tx.status,
    transactionDate: tx.transactionDate.toISOString(),
    createdBy,
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

class TransactionService {
  /**
   * Catat transaksi MASUK (donor darah).
   *
   * Urutan side-effects:
   *  1. Validasi donor exist & eligible
   *  2. Simpan transaksi
   *  3. Sinkronisasi stok (+quantity) via bloodStockService
   *  4. Update riwayat donor (lastDonationDate, totalDonations, nextEligibleDate)
   *
   * Catatan: langkah 3 & 4 dilakukan SETELAH transaksi tersimpan.
   * Jika salah satu gagal, transaksi tetap tercatat tapi stok/donor belum terupdate.
   * Untuk produksi, pertimbangkan Mongoose session / transaction jika butuh atomisitas penuh.
   */
  async createIn(
    dto: CreateTransactionInDto,
    adminId: string,
  ): Promise<TransactionResponse> {
    // 1. Validasi donor
    const donor = await donorRepository.findById(dto.donorId);
    if (!donor || !donor.isActive) {
      throw new AppError(
        'Pendonor tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    if (!donor.isEligible()) {
      const days = donor.getDaysUntilEligible();
      throw new AppError(
        `Pendonor belum eligible untuk donor. ${days} hari lagi.`,
        HTTP_CODE.BAD_REQUEST,
        'DONOR_NOT_ELIGIBLE',
      );
    }

    // 2. Simpan transaksi
    const transaction = await transactionRepository.createIn(
      dto,
      donor.fullName,
      adminId,
    );

    // 3. Sinkronisasi stok darah (tambah)
    await bloodStockService.syncStockFromTransaction(
      dto.bloodType,
      dto.rhesus,
      dto.quantity, // delta positif = masuk
      adminId,
    );

    // 4. Update riwayat donor
    await donorRepository.recordDonation(dto.donorId);

    return formatTransaction(transaction);
  }

  /**
   * Catat transaksi KELUAR (distribusi ke RS/pasien).
   *
   * Side-effects:
   *  1. Validasi stok mencukupi (dihandle di bloodStockService.syncStockFromTransaction)
   *  2. Simpan transaksi
   *  3. Sinkronisasi stok darah (-quantity)
   */
  async createOut(
    dto: CreateTransactionOutDto,
    adminId: string,
  ): Promise<TransactionResponse> {
    // Validasi stok + kurangi stok.
    // syncStockFromTransaction sudah melempar AppError jika stok tidak cukup,
    // sehingga transaksi tidak akan tersimpan jika stok kurang.
    await bloodStockService.syncStockFromTransaction(
      dto.bloodType,
      dto.rhesus,
      -dto.quantity, // delta negatif = keluar
      adminId,
    );

    // Simpan transaksi setelah stok berhasil dikurangi
    const transaction = await transactionRepository.createOut(dto, adminId);
    return formatTransaction(transaction);
  }

  async getAll(
    query: QueryTransactionDto,
  ): Promise<PaginatedTransactionResponse> {
    const { page = 1, limit = 10 } = query;
    const { data, total } = await transactionRepository.findAll(query);
    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map(formatTransaction),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getById(id: string): Promise<TransactionResponse> {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      throw new AppError(
        'Transaksi tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    return formatTransaction(transaction);
  }

  async getByDonor(donorId: string): Promise<TransactionResponse[]> {
    const donor = await donorRepository.findById(donorId);
    if (!donor) {
      throw new AppError(
        'Pendonor tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    const transactions = await transactionRepository.findByDonorId(donorId);
    return transactions.map(formatTransaction);
  }

  async update(
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponse> {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      throw new AppError(
        'Transaksi tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    if (transaction.status === TransactionStatus.CANCELLED) {
      throw new AppError(
        'Transaksi yang sudah dibatalkan tidak dapat diubah',
        HTTP_CODE.BAD_REQUEST,
        'TRANSACTION_CANCELLED',
      );
    }

    const updated = await transactionRepository.update(id, dto);
    return formatTransaction(updated!);
  }

  /**
   * Batalkan transaksi + rollback stok via bloodStockService.
   *
   *  - Transaksi IN dibatalkan → stok dikurangi kembali (delta negatif)
   *  - Transaksi OUT dibatalkan → stok ditambah kembali (delta positif)
   */
  async cancel(id: string, adminId: string): Promise<{ message: string }> {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      throw new AppError(
        'Transaksi tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    if (transaction.status === TransactionStatus.CANCELLED) {
      throw new AppError(
        'Transaksi sudah dibatalkan sebelumnya',
        HTTP_CODE.BAD_REQUEST,
        'ALREADY_CANCELLED',
      );
    }

    // Rollback stok
    const rollbackDelta =
      transaction.type === TransactionType.IN
        ? -transaction.quantity // IN dibatalkan → kurangi stok
        : transaction.quantity; // OUT dibatalkan → kembalikan stok

    await bloodStockService.syncStockFromTransaction(
      transaction.bloodType,
      transaction.rhesus,
      rollbackDelta,
      adminId,
    );

    await transactionRepository.cancel(id);

    return {
      message: 'Transaksi berhasil dibatalkan dan stok telah disesuaikan',
    };
  }

  async getStats(): Promise<TransactionStatsResponse> {
    return transactionRepository.getStats();
  }
}

export const transactionService = new TransactionService();
