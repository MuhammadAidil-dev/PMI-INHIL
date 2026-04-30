import { FilterQuery, Types } from 'mongoose';
import { TransactionModel } from './transaction.model';
import {
  BloodComponent,
  BloodType,
  CreateTransactionInDto,
  CreateTransactionOutDto,
  ITransaction,
  QueryTransactionDto,
  RhesusType,
  TransactionStatus,
  TransactionType,
  UpdateTransactionDto,
} from './transaction.type';

class TransactionRepository {
  // ── Create ──────────────────────────────────────────────────────────────

  async createIn(
    dto: CreateTransactionInDto,
    donorName: string,
    adminId: string,
  ): Promise<ITransaction> {
    const doc = new TransactionModel({
      type: TransactionType.IN,
      donorId: new Types.ObjectId(dto.donorId),
      donorName,
      bloodType: dto.bloodType,
      rhesus: dto.rhesus,
      component: dto.component,
      quantity: dto.quantity,
      notes: dto.notes ?? null,
      transactionDate: dto.transactionDate
        ? new Date(dto.transactionDate)
        : new Date(),
      createdBy: new Types.ObjectId(adminId),
    });
    return doc.save();
  }

  async createOut(
    dto: CreateTransactionOutDto,
    adminId: string,
  ): Promise<ITransaction> {
    const doc = new TransactionModel({
      type: TransactionType.OUT,
      donorId: null,
      donorName: null,
      bloodType: dto.bloodType,
      rhesus: dto.rhesus,
      component: dto.component,
      quantity: dto.quantity,
      recipientName: dto.recipientName,
      recipientHospital: dto.recipientHospital,
      recipientPhone: dto.recipientPhone ?? null,
      notes: dto.notes ?? null,
      transactionDate: dto.transactionDate
        ? new Date(dto.transactionDate)
        : new Date(),
      createdBy: new Types.ObjectId(adminId),
    });
    return doc.save();
  }

  // ── Read ────────────────────────────────────────────────────────────────

  async findById(id: string): Promise<ITransaction | null> {
    return TransactionModel.findById(id).populate('createdBy', 'username');
  }

  async findAll(
    query: QueryTransactionDto,
  ): Promise<{ data: ITransaction[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      type,
      bloodType,
      rhesus,
      component,
      status,
      donorId,
      startDate,
      endDate,
      search,
    } = query;

    const filter: FilterQuery<ITransaction> = {};

    if (type) filter.type = type;
    if (bloodType) filter.bloodType = bloodType;
    if (rhesus) filter.rhesus = rhesus;
    if (component) filter.component = component;
    if (status) filter.status = status;
    if (donorId) filter.donorId = new Types.ObjectId(donorId);

    if (startDate || endDate) {
      filter.transactionDate = {};
      if (startDate) filter.transactionDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.transactionDate.$lte = end;
      }
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { donorName: regex },
        { recipientName: regex },
        { recipientHospital: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      TransactionModel.find(filter)
        .sort({ transactionDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'username'),
      TransactionModel.countDocuments(filter),
    ]);

    return { data, total };
  }

  async findByDonorId(donorId: string): Promise<ITransaction[]> {
    return TransactionModel.find({
      donorId: new Types.ObjectId(donorId),
      status: TransactionStatus.COMPLETED,
    }).sort({ transactionDate: -1 });
  }

  // ── Update ──────────────────────────────────────────────────────────────

  async update(
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<ITransaction | null> {
    return TransactionModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true },
    );
  }

  async cancel(id: string): Promise<ITransaction | null> {
    return TransactionModel.findByIdAndUpdate(
      id,
      { $set: { status: TransactionStatus.CANCELLED } },
      { new: true },
    );
  }

  // ── Stats ────────────────────────────────────────────────────────────────

  async getStats(): Promise<{
    totalIn: number;
    totalOut: number;
    totalCancelled: number;
    byBloodType: Record<string, { in: number; out: number }>;
    byComponent: Record<string, { in: number; out: number }>;
    last30Days: { totalIn: number; totalOut: number };
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [overallAgg, bloodTypeAgg, componentAgg, last30Agg] =
      await Promise.all([
        // Total per tipe + status (dalam kantong)
        TransactionModel.aggregate([
          {
            $group: {
              _id: { type: '$type', status: '$status' },
              totalQty: { $sum: '$quantity' },
            },
          },
        ]),

        // Per kombinasi golongan darah + rhesus
        TransactionModel.aggregate([
          { $match: { status: TransactionStatus.COMPLETED } },
          {
            $group: {
              _id: {
                label: { $concat: ['$bloodType', '$rhesus'] },
                type: '$type',
              },
              totalQty: { $sum: '$quantity' },
            },
          },
        ]),

        // Per komponen
        TransactionModel.aggregate([
          { $match: { status: TransactionStatus.COMPLETED } },
          {
            $group: {
              _id: { component: '$component', type: '$type' },
              totalQty: { $sum: '$quantity' },
            },
          },
        ]),

        // 30 hari terakhir
        TransactionModel.aggregate([
          {
            $match: {
              status: TransactionStatus.COMPLETED,
              transactionDate: { $gte: thirtyDaysAgo },
            },
          },
          { $group: { _id: '$type', totalQty: { $sum: '$quantity' } } },
        ]),
      ]);

    // Proses overall
    let totalIn = 0;
    let totalOut = 0;
    let totalCancelled = 0;
    for (const row of overallAgg) {
      if (row._id.status === TransactionStatus.CANCELLED) {
        totalCancelled += row.totalQty;
      } else if (row._id.type === TransactionType.IN) {
        totalIn += row.totalQty;
      } else {
        totalOut += row.totalQty;
      }
    }

    // Proses byBloodType — key: "A+", "B-", dsb
    const byBloodType: Record<string, { in: number; out: number }> = {};
    for (const row of bloodTypeAgg) {
      const label = row._id.label as string;
      if (!byBloodType[label]) byBloodType[label] = { in: 0, out: 0 };
      if (row._id.type === TransactionType.IN) {
        byBloodType[label].in += row.totalQty;
      } else {
        byBloodType[label].out += row.totalQty;
      }
    }

    // Proses byComponent
    const byComponent: Record<string, { in: number; out: number }> = {};
    for (const row of componentAgg) {
      const comp = row._id.component as string;
      if (!byComponent[comp]) byComponent[comp] = { in: 0, out: 0 };
      if (row._id.type === TransactionType.IN) {
        byComponent[comp].in += row.totalQty;
      } else {
        byComponent[comp].out += row.totalQty;
      }
    }

    // Proses last30Days
    const last30Map = last30Agg.reduce(
      (acc, cur) => ({ ...acc, [cur._id]: cur.totalQty }),
      {} as Record<string, number>,
    );

    return {
      totalIn,
      totalOut,
      totalCancelled,
      byBloodType,
      byComponent,
      last30Days: {
        totalIn: last30Map[TransactionType.IN] ?? 0,
        totalOut: last30Map[TransactionType.OUT] ?? 0,
      },
    };
  }
}

export const transactionRepository = new TransactionRepository();
