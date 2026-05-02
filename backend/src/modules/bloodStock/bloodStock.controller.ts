import { Request, Response } from 'express';
import { HTTP_CODE } from '@/common/error/httpCode';
import { bloodStockService } from './bloodStock.service';
import { BloodType, RhesusType, BloodStockDTO } from './bloodStock.type';
import { ApiResponse } from '@/common/types/api-response.type';

type AllStockResponse = {
  stocks: BloodStockDTO[];
  summary: { totalBags: number; criticalCount: number };
};

type CriticalStockResponse = {
  stocks: BloodStockDTO[];
  count: number;
};

/**
 * GET /api/blood-stocks
 * Public — tanpa auth
 */
export const getAllStock = async (
  req: Request,
  res: Response<ApiResponse<AllStockResponse>>,
) => {
  const result = await bloodStockService.getAllStock();

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Data stok darah berhasil diambil',
    data: result,
  });
};

/**
 * GET /api/blood-stocks/admin/critical
 * Admin only
 */
export const getCriticalStock = async (
  req: Request,
  res: Response<ApiResponse<CriticalStockResponse>>,
) => {
  const stocks = await bloodStockService.getCriticalStock();

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Data stok kritis berhasil diambil',
    data: { stocks, count: stocks.length },
  });
};

/**
 * GET /api/blood-stocks/:bloodType/:rhesus
 * Public — tanpa auth
 */
export const getStockDetail = async (
  req: Request,
  res: Response<ApiResponse<BloodStockDTO>>,
) => {
  const { bloodType, rhesus } = req.params;

  const stock = await bloodStockService.getStockDetail(
    bloodType as BloodType,
    rhesus as RhesusType,
  );

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Detail stok darah berhasil diambil',
    data: stock,
  });
};

/**
 * POST /api/blood-stocks/init
 * Superadmin only — idempotent, aman dijalankan ulang
 */
export const initBloodStock = async (
  req: Request,
  res: Response<ApiResponse>,
) => {
  const admin = (req as any).admin;
  const { minThreshold } = res.locals.body;

  const result = await bloodStockService.initAllBloodTypes(
    admin._id.toString(),
    minThreshold,
  );

  res.status(HTTP_CODE.CREATED).json({
    success: true,
    message: result.message,
  });
};

/**
 * PATCH /api/blood-stocks/adjust
 * Admin only — koreksi stok manual (rusak / kadaluarsa)
 */
export const adjustStock = async (
  req: Request,
  res: Response<ApiResponse<BloodStockDTO>>,
) => {
  const admin = (req as any).admin;
  const payload = res.locals.body;

  const updated = await bloodStockService.adjustStock(
    payload,
    admin._id.toString(),
  );

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: `Stok darah ${updated.label} berhasil disesuaikan. Total sekarang: ${updated.totalBags} kantong`,
    data: updated,
  });
};

/**
 * PATCH /api/blood-stocks/threshold
 * Admin only — update batas minimum peringatan kritis
 */
export const updateThreshold = async (
  req: Request,
  res: Response<ApiResponse<BloodStockDTO>>,
) => {
  const admin = (req as any).admin;
  const payload = res.locals.body;

  const updated = await bloodStockService.updateThreshold(
    payload,
    admin._id.toString(),
  );

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: `Threshold stok darah ${updated.label} berhasil diperbarui menjadi ${updated.minThreshold} kantong`,
    data: updated,
  });
};
