import { Router } from 'express';
import { donorController } from './donor.controller';
import {
  createDonorSchema,
  queryDonorSchema,
  updateDonorSchema,
} from './donor.validation';
import { authenticate, authorize } from '@/middleware/authenticateMiddleware';
import { validate } from '@/middleware/validatePayload';
import { asyncHandler } from '@/common/utils/asyncHandler';

const donorRouter = Router();

// Semua route donor butuh autentikasi admin
donorRouter.use(authenticate, authorize('admin'));

// ── Collection routes ─────────────────────────────────────────────────────────
donorRouter.get(
  '/',
  validate(queryDonorSchema), // validasi query params
  asyncHandler(donorController.getAll),
);

donorRouter.post(
  '/',
  validate(createDonorSchema),
  asyncHandler(donorController.create),
);

// ── Utility routes ────────────────────────────────────────────────────────────
// Harus SEBELUM /:id agar tidak tertangkap sebagai param
donorRouter.get('/stats', donorController.getStats);
donorRouter.get(
  '/eligible-notification',
  asyncHandler(donorController.getEligibleForNotification),
);

// ── Item routes ───────────────────────────────────────────────────────────────
donorRouter.get('/:id', asyncHandler(donorController.getById));

donorRouter.patch(
  '/:id',
  validate(updateDonorSchema),
  asyncHandler(donorController.update),
);

donorRouter.delete('/:id', asyncHandler(donorController.softDelete));

export default donorRouter;
