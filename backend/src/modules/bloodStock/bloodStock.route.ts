import { Router } from 'express';
import {
  adjustStockSchema,
  initStockSchema,
  updateThresholdSchema,
} from './bloodStock.validation';
import {
  adjustStock,
  getAllStock,
  getCriticalStock,
  getStockDetail,
  initBloodStock,
  updateThreshold,
} from './bloodStock.controller';
import { authenticate, authorize } from '@/middleware/authenticateMiddleware';
import { validate } from '@/middleware/validatePayload';
import { asyncHandler } from '@/common/utils/asyncHandler';

const bloodStockRouter = Router();

/**
 * GET /api/blood-stocks/admin/critical
 * Daftar stok kritis untuk dashboard admin & trigger notifikasi WA
 * @access Private Perlu token
 */
bloodStockRouter.get(
  '/admin/critical',
  authenticate,
  asyncHandler(getCriticalStock),
);

// ─────────────────────────────────────────────
// PUBLIC ROUTES (tidak perlu login)
// Masyarakat bisa lihat ketersediaan darah secara real-time
// ─────────────────────────────────────────────

/**
 * @access Public
 */

/**
 * GET /api/blood-stocks
 * Semua stok darah + summary (total kantong, jumlah kritis)
 */
bloodStockRouter.get('/', asyncHandler(getAllStock));

/**
 * GET /api/blood-stocks/:bloodType/:rhesus
 * Detail stok satu golongan. Contoh: GET /api/blood-stocks/A/%2B
 * Note: rhesus "+" perlu di-encode jadi "%2B" di URL
 */
bloodStockRouter.get('/:bloodType/:rhesus', asyncHandler(getStockDetail));

// ─────────────────────────────────────────────
// PROTECTED ROUTES (harus login sebagai admin)
// ─────────────────────────────────────────────

/**
 * @access Private (harus login sebagai admin/superadmin)
 */

/**
 * POST /api/blood-stocks/init
 * Setup awal: inisialisasi 8 golongan darah dengan stok 0
 * Hanya superadmin
 */
bloodStockRouter.post(
  '/init',
  authenticate,
  authorize('superadmin'),
  validate(initStockSchema),
  asyncHandler(initBloodStock),
);

/**
 * PATCH /api/blood-stocks/adjust
 * Koreksi stok manual (kantong rusak, kadaluarsa, dll.)
 * Admin biasa bisa akses
 */
bloodStockRouter.patch(
  '/adjust',
  authenticate,
  authorize('admin', 'superadmin'),
  validate(adjustStockSchema),
  asyncHandler(adjustStock),
);

/**
 * PATCH /api/blood-stocks/threshold
 * Update batas minimum sebelum stok dianggap kritis
 */
bloodStockRouter.patch(
  '/threshold',
  authenticate,
  authorize('admin', 'superadmin'),
  validate(updateThresholdSchema),
  asyncHandler(updateThreshold),
);

export default bloodStockRouter;
