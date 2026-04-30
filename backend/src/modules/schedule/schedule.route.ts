import { Router } from 'express';
import {
  createScheduleSchema,
  updateScheduleSchema,
} from './schedule.validation';
import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  cancelSchedule,
  deleteSchedule,
  getPublicSchedules,
} from './schedule.controller';
import { authenticate, authorize } from '@/middleware/authenticateMiddleware';
import { validate } from '@/middleware/validatePayload';
import { asyncHandler } from '@/common/utils/asyncHandler';

// ─── Admin Routes (authentication required) ──────────────────────────────────
export const scheduleAdminRouter = Router();

/**
 * @route   POST /api/admin/schedules
 * @desc    Create a new donation schedule
 * @access  Admin
 */
scheduleAdminRouter.post(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  validate(createScheduleSchema),
  asyncHandler(createSchedule),
);

/**
 * @route   GET /api/admin/schedules
 * @desc    Get all schedules (with filter & pagination)
 * @access  Admin
 * @query   status, dateFrom, dateTo, search, page, limit
 */
scheduleAdminRouter.get(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  asyncHandler(getAllSchedules),
);

/**
 * @route   GET /api/admin/schedules/:id
 * @desc    Get a single schedule by ID
 * @access  Admin
 */
scheduleAdminRouter.get(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  asyncHandler(getScheduleById),
);

/**
 * @route   PATCH /api/admin/schedules/:id
 * @desc    Update a schedule
 * @access  Admin
 */
scheduleAdminRouter.patch(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  validate(updateScheduleSchema),
  asyncHandler(updateSchedule),
);

/**
 * @route   PATCH /api/admin/schedules/:id/cancel
 * @desc    Cancel a schedule (status → cancelled)
 * @access  Admin
 */
scheduleAdminRouter.patch(
  '/:id/cancel',
  authenticate,
  authorize('admin', 'superadmin'),
  asyncHandler(cancelSchedule),
);

/**
 * @route   DELETE /api/admin/schedules/:id
 * @desc    Permanently delete a schedule
 * @access  Admin
 */
scheduleAdminRouter.delete(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  asyncHandler(deleteSchedule),
);

// ─── Public Routes (no authentication required) ───────────────────────────────
export const schedulePublicRouter = Router();

/**
 * @route   GET /api/public/schedules
 * @desc    Get upcoming donation schedules for the public
 * @access  Public
 */
schedulePublicRouter.get('/', asyncHandler(getPublicSchedules));

/**
 * @route   GET /api/public/schedules/:id
 * @desc    Get a single schedule detail for the public
 * @access  Public
 */
schedulePublicRouter.get('/:id', asyncHandler(getScheduleById));
