import { Request, Response } from 'express';
import { scheduleService } from './schedule.service';
import { HTTP_CODE } from '@/common/error/httpCode';
import { ScheduleStatus } from './schedule.type';

/**
 * POST /api/admin/schedules
 * Create a new donation schedule
 */
export const createSchedule = async (req: Request, res: Response) => {
  const body = res.locals.body;
  const admin = (req as any).admin;

  const schedule = await scheduleService.create({
    ...body,
    createdBy: admin._id,
  });

  return res.status(HTTP_CODE.CREATED).json({
    success: true,
    message: 'Donation schedule created successfully',
    data: schedule,
  });
};

/**
 * GET /api/admin/schedules
 * Get all schedules with filter & pagination (admin)
 */
export const getAllSchedules = async (req: Request, res: Response) => {
  const { status, dateFrom, dateTo, search, page, limit } = req.query;

  const filter = {
    status: status as ScheduleStatus | undefined,
    dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
    dateTo: dateTo ? new Date(dateTo as string) : undefined,
    search: search as string | undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  };

  const result = await scheduleService.getAll(filter);

  return res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Schedules retrieved successfully',
    data: result.data,
    meta: {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      limit: filter.limit,
    },
  });
};

/**
 * GET /api/public/schedules
 * Get upcoming schedules for the public page
 */
export const getPublicSchedules = async (_req: Request, res: Response) => {
  const schedules = await scheduleService.getPublic();

  return res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Upcoming donation schedules',
    data: schedules,
  });
};

/**
 * GET /api/admin/schedules/:id
 * GET /api/public/schedules/:id
 * Get a single schedule by ID
 */
export const getScheduleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const schedule = await scheduleService.getById(id);

  return res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Schedule retrieved successfully',
    data: schedule,
  });
};

/**
 * PUT /api/admin/schedules/:id
 * Update a schedule
 */
export const updateSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = res.locals.body;

  const schedule = await scheduleService.update(id, body);

  return res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Donation schedule updated successfully',
    data: schedule,
  });
};

/**
 * PATCH /api/admin/schedules/:id/cancel
 * Cancel a schedule (set status to 'cancelled')
 */
export const cancelSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const schedule = await scheduleService.cancel(id);

  return res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Donation schedule cancelled successfully',
    data: schedule,
  });
};

/**
 * DELETE /api/admin/schedules/:id
 * Permanently delete a schedule
 */
export const deleteSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  await scheduleService.delete(id);

  return res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Donation schedule deleted successfully',
  });
};
