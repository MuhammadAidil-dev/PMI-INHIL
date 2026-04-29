import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/httpCode';
import { bloodStockRepository } from './bloodStock.repository';
import {
  BloodStockDTO,
  BloodStockLean,
  BloodType,
  RhesusType,
} from './bloodStock.type';

export interface AdjustStockPayload {
  bloodType: BloodType;
  rhesus: RhesusType;
  adjustment: number;
  reason: string;
}

export interface UpdateThresholdPayload {
  bloodType: BloodType;
  rhesus: RhesusType;
  minThreshold: number;
}

class BloodStockService {
  // ─── Private Helper ───────────────────────────────────────────────────────

  private toDTO(stock: BloodStockLean): BloodStockDTO {
    return {
      id: stock._id.toString(),
      label: `${stock.bloodType}${stock.rhesus}`,
      bloodType: stock.bloodType,
      rhesus: stock.rhesus,
      totalBags: stock.totalBags,
      minThreshold: stock.minThreshold,
      isCritical: stock.totalBags <= stock.minThreshold,
      lastUpdated: stock.lastUpdated,
      updatedBy: stock.updatedBy as BloodStockDTO['updatedBy'],
    };
  }

  private async findOneOrThrow(
    bloodType: BloodType,
    rhesus: RhesusType,
  ): Promise<BloodStockLean> {
    const stock = await bloodStockRepository.findOne(bloodType, rhesus);
    if (!stock) {
      throw new AppError(
        `Stok darah ${bloodType}${rhesus} tidak ditemukan`,
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    return stock;
  }

  // ─── Public Methods ───────────────────────────────────────────────────────

  /**
   * Inisialisasi semua 8 golongan darah.
   * Idempotent: aman dijalankan berulang kali.
   */
  async initAllBloodTypes(
    adminId: string,
    minThreshold: number,
  ): Promise<{ message: string }> {
    await bloodStockRepository.initAllBloodTypes(adminId, minThreshold);
    return { message: 'Inisialisasi stok darah berhasil' };
  }

  /**
   * Ambil semua stok darah beserta summary agregat.
   */
  async getAllStock(): Promise<{
    stocks: BloodStockDTO[];
    summary: { totalBags: number; criticalCount: number };
  }> {
    const raws = await bloodStockRepository.findAll();
    const stocks = raws.map((s) => this.toDTO(s));

    return {
      stocks,
      summary: {
        totalBags: stocks.reduce((sum, s) => sum + s.totalBags, 0),
        criticalCount: stocks.filter((s) => s.isCritical).length,
      },
    };
  }

  /**
   * Ambil detail stok satu golongan darah.
   */
  async getStockDetail(
    bloodType: BloodType,
    rhesus: RhesusType,
  ): Promise<BloodStockDTO> {
    const stock = await this.findOneOrThrow(bloodType, rhesus);
    return this.toDTO(stock);
  }

  /**
   * Ambil daftar stok kritis untuk dashboard & trigger notifikasi WA.
   */
  async getCriticalStock(): Promise<BloodStockDTO[]> {
    const raws = await bloodStockRepository.findCritical();
    return raws.map((s) => this.toDTO(s));
  }

  /**
   * Penyesuaian stok manual (kantong rusak / kadaluarsa).
   * Guard: hasil akhir tidak boleh negatif.
   */
  async adjustStock(
    payload: AdjustStockPayload,
    adminId: string,
  ): Promise<BloodStockDTO> {
    const { bloodType, rhesus, adjustment } = payload;

    const current = await this.findOneOrThrow(bloodType, rhesus);

    if (current.totalBags + adjustment < 0) {
      throw new AppError(
        `Penyesuaian tidak valid. Stok saat ini ${current.totalBags} kantong, tidak bisa dikurangi ${Math.abs(adjustment)} kantong`,
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.INTERNAL_SERVER,
      );
    }

    const updated = await bloodStockRepository.incrementStock(
      bloodType,
      rhesus,
      adjustment,
      adminId,
    );
    if (!updated) {
      throw new AppError(
        'Gagal memperbarui stok darah',
        HTTP_CODE.INTERNAL_SERVER,
        ERROR_CODE.INTERNAL_SERVER,
      );
    }

    return this.toDTO(updated);
  }

  /**
   * Update minimum threshold (batas peringatan kritis).
   */
  async updateThreshold(
    payload: UpdateThresholdPayload,
    adminId: string,
  ): Promise<BloodStockDTO> {
    const { bloodType, rhesus, minThreshold } = payload;

    const updated = await bloodStockRepository.updateThreshold(
      bloodType,
      rhesus,
      minThreshold,
      adminId,
    );
    if (!updated) {
      throw new AppError(
        `Stok darah ${bloodType}${rhesus} tidak ditemukan`,
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    return this.toDTO(updated);
  }

  /**
   * Dipanggil oleh TransaksiService — bukan controller.
   * Sinkronisasi stok otomatis setiap ada transaksi masuk/keluar.
   * delta positif = masuk, negatif = keluar.
   */
  async syncStockFromTransaction(
    bloodType: BloodType,
    rhesus: RhesusType,
    delta: number,
    adminId: string,
  ): Promise<void> {
    const current = await this.findOneOrThrow(bloodType, rhesus);

    if (current.totalBags + delta < 0) {
      throw new AppError(
        `Stok ${bloodType}${rhesus} tidak mencukupi. Tersedia: ${current.totalBags} kantong`,
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.INTERNAL_SERVER,
      );
    }

    await bloodStockRepository.incrementStock(
      bloodType,
      rhesus,
      delta,
      adminId,
    );
  }
}

export const bloodStockService = new BloodStockService();
