import { Router } from 'express';
import {
  createNewsSchema,
  updateNewsSchema,
  togglePublishSchema,
} from './news.validation';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsPublish,
} from './news.controller';
import { authenticate, authorize } from '@/middleware/authenticateMiddleware';
import { validate } from '@/middleware/validatePayload';
import { upload } from '@/common/utils/lib-utils';
import { asyncHandler } from '@/common/utils/asyncHandler';

const newsRouter = Router();

// ─── Public Routes (no auth needed) ──────────────────────────────────────────
newsRouter.get('/', asyncHandler(getAllNews));
newsRouter.get('/:id', asyncHandler(getNewsById));

// ─── Protected Routes (admin only) ───────────────────────────────────────────
newsRouter.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  validate(createNewsSchema),
  asyncHandler(createNews),
);

newsRouter.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  validate(updateNewsSchema),
  asyncHandler(updateNews),
);

newsRouter.patch(
  '/:id/publish',
  authenticate,
  authorize('admin'),
  validate(togglePublishSchema),
  asyncHandler(toggleNewsPublish),
);

newsRouter.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(deleteNews),
);

export default newsRouter;
