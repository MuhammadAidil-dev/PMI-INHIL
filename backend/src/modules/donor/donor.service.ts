import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/httpCode';
import { donorRepository } from './donor.repository';
import {
  CreateDonorDto,
  DonorResponse,
  IDonor,
  PaginatedDonorResponse,
  QueryDonorDto,
  UpdateDonorDto,
} from './donor.type';

// ── Helper: format IDonor → DonorResponse ────────────────────────────────────

function formatDonor(donor: IDonor): DonorResponse {
  return {
    id: donor._id.toString(),
    fullName: donor.fullName,
    nik: donor.nik,
    gender: donor.gender,
    birthDate: donor.birthDate.toISOString(),
    address: donor.address,
    phone: donor.phone,
    bloodType: donor.bloodType,
    weight: donor.weight,
    hemoglobin: donor.hemoglobin,
    status: donor.status,
    totalDonations: donor.totalDonations,
    lastDonationDate: donor.lastDonationDate?.toISOString() ?? null,
    nextEligibleDate: donor.nextEligibleDate?.toISOString() ?? null,
    daysUntilEligible: donor.getDaysUntilEligible(),
    isEligible: donor.isEligible(),
    isActive: donor.isActive,
    createdAt: donor.createdAt.toISOString(),
    updatedAt: donor.updatedAt.toISOString(),
  };
}

// ── Service ──────────────────────────────────────────────────────────────────

export const donorService = {
  async create(dto: CreateDonorDto): Promise<DonorResponse> {
    // Cek duplikat NIK
    const byNik = await donorRepository.findByNik(dto.nik);
    if (byNik) {
      throw new AppError(
        'NIK sudah terdaftar',
        HTTP_CODE.CONFLICT,
        ERROR_CODE.DUPLICATE_KEY,
      );
    }

    // Cek duplikat nomor WA
    const byPhone = await donorRepository.findByPhone(dto.phone);
    if (byPhone) {
      throw new AppError(
        'Nomor WhatsApp sudah terdaftar',
        HTTP_CODE.CONFLICT,
        ERROR_CODE.DUPLICATE_KEY,
      );
    }

    const donor = await donorRepository.create(dto);
    return formatDonor(donor);
  },

  async getAll(query: QueryDonorDto): Promise<PaginatedDonorResponse> {
    const { page = 1, limit = 10 } = query;
    const { data, total } = await donorRepository.findAll(query);
    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map(formatDonor),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  async getDonorsRecent(): Promise<DonorResponse[]> {
    const donorRecent = await donorRepository.findDonorsHistory();

    return donorRecent.map(formatDonor);
  },

  async getById(id: string): Promise<DonorResponse> {
    const donor = await donorRepository.findById(id);
    if (!donor || !donor.isActive) {
      throw new AppError(
        'Pendonor tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    return formatDonor(donor);
  },

  async update(id: string, dto: UpdateDonorDto): Promise<DonorResponse> {
    // Cek duplikat phone jika diubah
    if (dto.phone) {
      const existing = await donorRepository.findByPhone(dto.phone);
      if (existing && existing._id.toString() !== id) {
        throw new AppError(
          'Nomor WhatsApp sudah digunakan pendonor lain',
          HTTP_CODE.CONFLICT,
          ERROR_CODE.DUPLICATE_KEY,
        );
      }
    }

    const donor = await donorRepository.update(id, dto);
    if (!donor) {
      throw new AppError(
        'Pendonor tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    return formatDonor(donor);
  },

  async softDelete(id: string): Promise<{ message: string }> {
    const donor = await donorRepository.softDelete(id);
    if (!donor) {
      throw new AppError(
        'Pendonor tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    return { message: `Pendonor ${donor.fullName} berhasil dinonaktifkan` };
  },

  /**
   * Dipanggil oleh transaksi service setelah transaksi donor dicatat.
   * Mengupdate riwayat donor dan menghitung ulang eligibilitas.
   */
  async recordDonation(donorId: string): Promise<DonorResponse> {
    const donor = await donorRepository.findById(donorId);
    if (!donor || !donor.isActive) {
      throw new AppError(
        'Pendonor tidak ditemukan',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    // Validasi eligibilitas sebelum mencatat
    if (!donor.isEligible()) {
      const days = donor.getDaysUntilEligible();
      throw new AppError(
        `Pendonor belum eligible. Masih ${days} hari lagi untuk donor berikutnya`,
        HTTP_CODE.BAD_REQUEST,
        'NOT_ELIGIBLE',
      );
    }

    const updated = await donorRepository.recordDonation(donorId);
    return formatDonor(updated!);
  },

  async getStats() {
    return donorRepository.getStats();
  },

  async getEligibleForNotification() {
    return donorRepository.findEligibleForNotification();
  },
};
