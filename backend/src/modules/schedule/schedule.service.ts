import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/httpCode';
import { scheduleRepository, ScheduleFilter } from './schedule.repository';
import {
  CreateScheduleDTO,
  ISchedule,
  UpdateScheduleDTO,
} from './schedule.type';

export const scheduleService = {
  /**
   * Create a new donation schedule
   */
  async create(dto: CreateScheduleDTO): Promise<ISchedule> {
    // Validate: endTime must be later than startTime
    if (dto.startTime >= dto.endTime) {
      throw new AppError(
        'End time must be later than start time',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    // Validate: date must not be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scheduleDate = new Date(dto.date);
    scheduleDate.setHours(0, 0, 0, 0);

    if (scheduleDate < today) {
      throw new AppError(
        'Schedule date must not be in the past',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    return scheduleRepository.create(dto as any);
  },

  /**
   * Get all schedules with filters (admin)
   */
  async getAll(filter: ScheduleFilter) {
    return scheduleRepository.findAll(filter);
  },

  /**
   * Get upcoming schedules for the public
   */
  async getPublic() {
    return scheduleRepository.findPublic(20);
  },

  /**
   * Get a single schedule by ID
   */
  async getById(id: string): Promise<ISchedule> {
    const schedule = await scheduleRepository.findById(id);
    if (!schedule) {
      throw new AppError(
        'Schedule not found',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
    return schedule;
  },

  /**
   * Update a schedule
   */
  async update(id: string, dto: UpdateScheduleDTO): Promise<ISchedule> {
    const existing = await scheduleRepository.findById(id);
    if (!existing) {
      throw new AppError(
        'Schedule not found',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    // Cannot edit a schedule that is completed or cancelled
    if (['completed', 'cancelled'].includes(existing.status)) {
      throw new AppError(
        `Cannot edit a schedule with status '${existing.status}'`,
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    // Validate time range using the merged values
    const startTime = dto.startTime ?? existing.startTime;
    const endTime = dto.endTime ?? existing.endTime;
    if (startTime >= endTime) {
      throw new AppError(
        'End time must be later than start time',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    // Validate date if it is being changed
    if (dto.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const scheduleDate = new Date(dto.date);
      scheduleDate.setHours(0, 0, 0, 0);

      if (scheduleDate < today) {
        throw new AppError(
          'Schedule date must not be in the past',
          HTTP_CODE.BAD_REQUEST,
          ERROR_CODE.BAD_REQUEST,
        );
      }
    }

    const updated = await scheduleRepository.update(id, dto as any);
    if (!updated) {
      throw new AppError(
        'Failed to update schedule',
        HTTP_CODE.INTERNAL_SERVER,
        ERROR_CODE.INTERNAL_SERVER,
      );
    }

    return updated;
  },

  /**
   * Cancel a schedule (soft cancel — data is preserved)
   */
  async cancel(id: string): Promise<ISchedule> {
    const existing = await scheduleRepository.findById(id);
    if (!existing) {
      throw new AppError(
        'Schedule not found',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    if (existing.status === 'completed') {
      throw new AppError(
        'A completed schedule cannot be cancelled',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    if (existing.status === 'cancelled') {
      throw new AppError(
        'Schedule is already cancelled',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    const updated = await scheduleRepository.update(id, {
      status: 'cancelled',
    });
    return updated!;
  },

  /**
   * Permanently delete a schedule
   */
  async delete(id: string): Promise<void> {
    const existing = await scheduleRepository.findById(id);
    if (!existing) {
      throw new AppError(
        'Schedule not found',
        HTTP_CODE.NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    // Safety: cannot delete an ongoing schedule — cancel it first
    if (existing.status === 'ongoing') {
      throw new AppError(
        'An ongoing schedule cannot be deleted. Cancel it first.',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.BAD_REQUEST,
      );
    }

    await scheduleRepository.delete(id);
  },
};
