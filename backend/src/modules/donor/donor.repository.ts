import { FilterQuery, Types } from 'mongoose';
import {
  CreateDonorDto,
  DonorStatus,
  IDonor,
  QueryDonorDto,
  UpdateDonorDto,
} from './donor.type';
import { DonorModel } from './donor.model';

export const donorRepository = {
  // ── Create ────────────────────────────────────────────────────────────────

  async create(dto: CreateDonorDto): Promise<IDonor> {
    const donor = new DonorModel({
      ...dto,
      birthDate: new Date(dto.birthDate),
    });
    return donor.save();
  },

  // ── Read ──────────────────────────────────────────────────────────────────

  async findById(id: string): Promise<IDonor | null> {
    return DonorModel.findById(id);
  },

  async findByNik(nik: string): Promise<IDonor | null> {
    return DonorModel.findOne({ nik });
  },

  async findByPhone(phone: string): Promise<IDonor | null> {
    return DonorModel.findOne({ phone });
  },

  /**
   * Paginated list dengan filter & search.
   * Search mencari di: fullName, nik, phone (case-insensitive).
   */
  async findAll(
    query: QueryDonorDto,
  ): Promise<{ data: IDonor[]; total: number }> {
    const { page = 1, limit = 10, search, bloodType, status, isActive } = query;

    const filter: FilterQuery<IDonor> = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ fullName: regex }, { nik: regex }, { phone: regex }];
    }
    if (bloodType) filter.bloodType = bloodType;
    if (status) filter.status = status;
    if (isActive !== undefined) filter.isActive = isActive;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      DonorModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DonorModel.countDocuments(filter),
    ]);

    return { data, total };
  },

  /**
   * Ambil semua donor terbaru > 7 hari terakhir
   */
  async findDonorsHistory(): Promise<IDonor[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return DonorModel.find({
      isActive: true,
      lastDonationDate: {
        $gte: sevenDaysAgo,
      },
    });
  },

  /**
   * Ambil semua pendonor yang sudah eligible dan belum dinotifikasi
   * dalam 30 hari terakhir. Dipakai oleh service notifikasi WA.
   */
  async findEligibleForNotification(): Promise<IDonor[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return DonorModel.find({
      isActive: true,
      status: { $in: [DonorStatus.ACTIVE, DonorStatus.INACTIVE] },
      nextEligibleDate: { $lte: new Date() },
      $or: [
        { lastNotificationSentAt: null },
        { lastNotificationSentAt: { $lte: thirtyDaysAgo } },
      ],
    }).select('fullName phone bloodType lastDonationDate nextEligibleDate');
  },

  // ── Update ────────────────────────────────────────────────────────────────

  async update(id: string, dto: UpdateDonorDto): Promise<IDonor | null> {
    const payload: Partial<IDonor> = { ...dto } as any;
    if (dto.birthDate) payload.birthDate = new Date(dto.birthDate);

    return DonorModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true },
    );
  },

  /**
   * Dipanggil setelah transaksi donor berhasil disimpan.
   * Update lastDonationDate, totalDonations.
   * nextEligibleDate & status dihitung otomatis oleh pre-save hook model.
   */
  async recordDonation(
    donorId: string | Types.ObjectId,
  ): Promise<IDonor | null> {
    const donor = await DonorModel.findById(donorId);
    if (!donor) return null;

    donor.lastDonationDate = new Date();
    donor.totalDonations = (donor.totalDonations || 0) + 1;
    // nextEligibleDate & status akan dihitung di pre-save hook
    return donor.save();
  },

  /**
   * Update timestamp notifikasi terakhir dikirim.
   */
  async markNotificationSent(donorId: string | Types.ObjectId): Promise<void> {
    await DonorModel.findByIdAndUpdate(donorId, {
      $set: { lastNotificationSentAt: new Date() },
    });
  },

  // ── Delete (soft delete) ──────────────────────────────────────────────────

  async softDelete(id: string): Promise<IDonor | null> {
    return DonorModel.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true },
    );
  },

  // ── Stats ─────────────────────────────────────────────────────────────────

  /**
   * Statistik ringkasan untuk dashboard.
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    cooldown: number;
    inactive: number;
    byBloodType: Record<string, number>;
  }> {
    const [statusAgg, bloodTypeAgg] = await Promise.all([
      DonorModel.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      DonorModel.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$bloodType', count: { $sum: 1 } } },
      ]),
    ]);

    const statusMap = statusAgg.reduce(
      (acc, cur) => ({ ...acc, [cur._id]: cur.count }),
      {} as Record<string, number>,
    );

    const byBloodType = bloodTypeAgg.reduce(
      (acc, cur) => ({ ...acc, [cur._id]: cur.count }),
      {} as Record<string, number>,
    );

    return {
      total:
        (statusMap.active ?? 0) +
        (statusMap.cooldown ?? 0) +
        (statusMap.inactive ?? 0),
      active: statusMap.active ?? 0,
      cooldown: statusMap.cooldown ?? 0,
      inactive: statusMap.inactive ?? 0,
      byBloodType,
    };
  },
};
