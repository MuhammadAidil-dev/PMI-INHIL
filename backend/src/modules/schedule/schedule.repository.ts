import mongoose from 'mongoose';
import { ISchedule, ScheduleDocument, ScheduleStatus } from './schedule.type';
import { ScheduleModel } from './schedule.model';

export interface ScheduleFilter {
  status?: ScheduleStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const scheduleRepository = {
  /**
   * Create a new donation schedule
   */
  async create(
    payload: Omit<ISchedule, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ISchedule> {
    const schedule = new ScheduleModel(payload);
    const saved = await schedule.save();
    return saved.toObject<ISchedule>();
  },

  /**
   * Find all schedules with filter & pagination (admin)
   */
  async findAll(filter: ScheduleFilter): Promise<PaginatedResult<ISchedule>> {
    const { status, dateFrom, dateTo, search, page = 1, limit = 10 } = filter;

    const query: mongoose.FilterQuery<ScheduleDocument> = {};

    if (status) query.status = status;

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = dateFrom;
      if (dateTo) query.date.$lte = dateTo;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      ScheduleModel.find(query)
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'username name')
        .lean<ISchedule[]>(),
      ScheduleModel.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Find upcoming schedules for the public page.
   * Only returns status 'upcoming' and 'ongoing'.
   */
  async findPublic(limit = 10): Promise<ISchedule[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return ScheduleModel.find({
      date: { $gte: today },
      status: { $in: ['upcoming', 'ongoing'] },
    })
      .sort({ date: 1 })
      .limit(limit)
      .select('-createdBy')
      .lean<ISchedule[]>();
  },

  /**
   * Find a single schedule by ID
   */
  async findById(id: string): Promise<ISchedule | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ScheduleModel.findById(id)
      .populate('createdBy', 'username name')
      .lean<ISchedule>();
  },

  /**
   * Update a schedule by ID
   */
  async update(
    id: string,
    payload: Partial<ISchedule>,
  ): Promise<ISchedule | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ScheduleModel.findByIdAndUpdate(
      id,
      { $set: payload },
      {
        new: true,
        runValidators: true,
      },
    ).lean<ISchedule>();
  },

  /**
   * Permanently delete a schedule by ID
   */
  async delete(id: string): Promise<ISchedule | null> {
    if (!mongoose.isValidObjectId(id)) return null;
    return ScheduleModel.findByIdAndDelete(id).lean<ISchedule>();
  },

  /**
   * Auto-update schedule statuses based on the current date.
   * Called by a cron job / scheduler.
   */
  async autoUpdateStatus(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Mark as 'completed' if the date has passed
    await ScheduleModel.updateMany(
      { date: { $lt: today }, status: { $in: ['upcoming', 'ongoing'] } },
      { $set: { status: 'completed' } },
    );

    // Mark as 'ongoing' if the schedule is today
    await ScheduleModel.updateMany(
      { date: { $gte: today, $lt: tomorrow }, status: 'upcoming' },
      { $set: { status: 'ongoing' } },
    );
  },

  /**
   * Increment registeredDonors count.
   * Called when a donation transaction is recorded for this schedule.
   */
  async incrementRegisteredDonors(id: string): Promise<void> {
    await ScheduleModel.findByIdAndUpdate(id, {
      $inc: { registeredDonors: 1 },
    });
  },
};
