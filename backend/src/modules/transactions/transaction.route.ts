import { Router } from 'express';
import { transactionController } from './transaction.controller';
import {
  createTransactionInSchema,
  createTransactionOutSchema,
  updateTransactionSchema,
} from './transaction.validation';
import { authenticate, authorize } from '@/middleware/authenticateMiddleware';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { validate } from '@/middleware/validatePayload';

const transactionRouter = Router();

// Semua route membutuhkan autentikasi admin
transactionRouter.use(authenticate, authorize('admin'));

// ── Static routes dulu — sebelum /:id agar tidak tertangkap sebagai param ────
transactionRouter.get('/stats', asyncHandler(transactionController.getStats));
transactionRouter.get(
  '/donor/:donorId',
  asyncHandler(transactionController.getByDonor),
);

// ── CRUD ──────────────────────────────────────────────────────────────────────
transactionRouter.get('/', asyncHandler(transactionController.getAll));

transactionRouter.post(
  '/in',
  validate(createTransactionInSchema),
  asyncHandler(transactionController.createIn),
);

transactionRouter.post(
  '/out',
  validate(createTransactionOutSchema),
  asyncHandler(transactionController.createOut),
);

transactionRouter.get('/:id', asyncHandler(transactionController.getById));

transactionRouter.patch(
  '/:id',
  validate(updateTransactionSchema),
  asyncHandler(transactionController.update),
);

transactionRouter.patch(
  '/:id/cancel',
  asyncHandler(transactionController.cancel),
);

export default transactionRouter;
