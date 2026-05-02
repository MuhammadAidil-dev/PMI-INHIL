import { FilterQuery, Types } from 'mongoose';
import { NotificationModel } from './notification.model';
import {
  INotification,
  NotificationStatus,
  NotificationType,
  NotificationTrigger,
  QueryNotificationDto,
} from './notification.type';

export const notificationRepository = {
  // ── Create ─────────────────────────────────────────────────────────────────

  async create(data: {
    donorId: Types.ObjectId | string;
    donorName: string;
    phone: string;
    message: string;
    type: NotificationType;
    trigger: NotificationTrigger;
  }): Promise<INotification> {
    const notif = new NotificationModel(data);
    return notif.save();
  },

  // ── Update: tandai sukses ──────────────────────────────────────────────────

  async markSent(
    id: string | Types.ObjectId,
    fonnteResponse: string,
  ): Promise<INotification | null> {
    return NotificationModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status: NotificationStatus.SENT,
          fonnteResponse,
          sentAt: new Date(),
          errorMessage: null,
        },
      },
      { new: true },
    );
  },

  // ── Update: tandai gagal ───────────────────────────────────────────────────

  async markFailed(
    id: string | Types.ObjectId,
    errorMessage: string,
  ): Promise<INotification | null> {
    return NotificationModel.findByIdAndUpdate(
      id,
      { $set: { status: NotificationStatus.FAILED, errorMessage } },
      { new: true },
    );
  },

  // ── Read: paginated list ───────────────────────────────────────────────────

  async findAll(
    query: QueryNotificationDto,
  ): Promise<{ data: INotification[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      donorId,
      status,
      type,
      trigger,
      startDate,
      endDate,
    } = query;

    const filter: FilterQuery<INotification> = {};

    if (donorId) filter.donorId = donorId;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (trigger) filter.trigger = trigger;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationModel.countDocuments(filter),
    ]);

    return { data, total };
  },

  // ── Read: by donor ─────────────────────────────────────────────────────────

  async findByDonorId(donorId: string): Promise<INotification[]> {
    return NotificationModel.find({ donorId })
      .sort({ createdAt: -1 })
      .limit(50);
  },

  // ── Stats ──────────────────────────────────────────────────────────────────

  async getStats(): Promise<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    todaySent: number;
  }> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [statusAgg, todaySent] = await Promise.all([
      NotificationModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      NotificationModel.countDocuments({
        status: NotificationStatus.SENT,
        sentAt: { $gte: todayStart },
      }),
    ]);

    const map = statusAgg.reduce(
      (acc, cur) => ({ ...acc, [cur._id]: cur.count }),
      {} as Record<string, number>,
    );

    return {
      total: (map.sent ?? 0) + (map.failed ?? 0) + (map.pending ?? 0),
      sent: map.sent ?? 0,
      failed: map.failed ?? 0,
      pending: map.pending ?? 0,
      todaySent,
    };
  },
};
