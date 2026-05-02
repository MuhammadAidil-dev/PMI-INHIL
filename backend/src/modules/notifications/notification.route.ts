import { Router } from 'express';
import { notificationController } from './notification.controller';
import {
  sendManualSchema,
  queryNotificationSchema,
} from './notification.validation';
import { authenticate, authorize } from '@/middleware/authenticateMiddleware';
import { validate } from '@/middleware/validatePayload';
import { asyncHandler } from '@/common/utils/asyncHandler';

const notificationRouter = Router();

// Semua route notifikasi butuh autentikasi
notificationRouter.use(authenticate);

// ── Kirim notifikasi ──────────────────────────────────────────────────────────

/**
 * POST /api/notifications/send
 * Kirim notifikasi WA manual ke pendonor yang dipilih.
 * Role: admin, superadmin
 */
notificationRouter.post(
  '/send',
  validate(sendManualSchema),
  asyncHandler(notificationController.sendManual),
);

/**
 * POST /api/notifications/send-scheduled
 * Trigger manual pengiriman notifikasi terjadwal (eligible reminder).
 * Role: superadmin only
 */
notificationRouter.post(
  '/send-scheduled',
  authorize('superadmin', 'admin'),
  asyncHandler(notificationController.triggerScheduled),
);

// ── Baca data notifikasi ──────────────────────────────────────────────────────

/**
 * GET /api/notifications/stats
 * Statistik notifikasi (total, sent, failed, todaySent).
 * Role: admin, superadmin
 */
notificationRouter.get('/stats', asyncHandler(notificationController.getStats));

/**
 * GET /api/notifications/templates
 * Preview template pesan default.
 * Role: admin, superadmin
 */
notificationRouter.get(
  '/templates',
  asyncHandler(notificationController.getTemplates),
);

/**
 * GET /api/notifications/logs
 * Riwayat semua notifikasi (paginated).
 * Query: page, limit, status, type, trigger, donorId, startDate, endDate
 * Role: admin, superadmin
 */
notificationRouter.get('/logs', asyncHandler(notificationController.getLogs));

/**
 * GET /api/notifications/logs/donor/:donorId
 * Riwayat notifikasi untuk satu pendonor.
 * Role: admin, superadmin
 */
notificationRouter.get(
  '/logs/donor/:donorId',
  asyncHandler(notificationController.getLogsByDonor),
);

export default notificationRouter;
