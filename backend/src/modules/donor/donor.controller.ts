import { Request, Response } from 'express';
import { HTTP_CODE } from '@/common/error/httpCode';
import { donorService } from './donor.service';
import {
  CreateDonorDto,
  DonorResponse,
  QueryDonorDto,
  UpdateDonorDto,
} from './donor.type';
import { ApiResponse, Meta } from '@/common/types/api-response.type';

type CreateDonor = ApiResponse<DonorResponse>;
type GetAllDonor = ApiResponse<DonorResponse[]>;

export const donorController = {
  /**
   * POST /donors
   * Tambah pendonor baru
   */
  create: async (req: Request, res: Response<CreateDonor>) => {
    const dto: CreateDonorDto = res.locals.body;
    const donor = await donorService.create(dto);

    return res.status(HTTP_CODE.CREATED).json({
      success: true,
      message: 'Pendonor berhasil ditambahkan',
      data: donor,
    });
  },

  /**
   * GET /donors
   * List pendonor dengan pagination, filter, dan search
   */
  getAll: async (req: Request, res: Response<GetAllDonor>) => {
    // Query sudah divalidasi & di-default oleh validate middleware
    const query: QueryDonorDto = res.locals.body ?? req.query;
    const result = await donorService.getAll(query);

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Data pendonor berhasil diambil',
      ...result,
    });
  },

  /**
   * GET /donors/recent
   * List pendonor 7 hari terakhir
   */
  getDonorsRecent: async (req: Request, res: Response<GetAllDonor>) => {
    const result = await donorService.getDonorsRecent();

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Data pendonor berhasil diambil',
      data: result,
    });
  },

  /**
   * GET /donors/stats
   * Statistik pendonor untuk dashboard
   */
  getStats: async (_req: Request, res: Response) => {
    const stats = await donorService.getStats();

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Statistik pendonor berhasil diambil',
      data: stats,
    });
  },

  /**
   * GET /donors/eligible-notification
   * List pendonor yang perlu dikirimi notifikasi WA
   */
  getEligibleForNotification: async (_req: Request, res: Response) => {
    const donors = await donorService.getEligibleForNotification();

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Data pendonor eligible untuk notifikasi',
      data: donors,
      total: donors.length,
    });
  },

  /**
   * GET /donors/:id
   * Detail satu pendonor
   */
  getById: async (req: Request, res: Response) => {
    const donor = await donorService.getById(req.params.id);

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Detail pendonor berhasil diambil',
      data: donor,
    });
  },

  /**
   * PATCH /donors/:id
   * Update data pendonor
   */
  update: async (req: Request, res: Response) => {
    const dto: UpdateDonorDto = res.locals.body;
    const donor = await donorService.update(req.params.id, dto);

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Data pendonor berhasil diperbarui',
      data: donor,
    });
  },

  /**
   * DELETE /donors/:id
   * Soft delete pendonor (set isActive = false)
   */
  softDelete: async (req: Request, res: Response) => {
    const result = await donorService.softDelete(req.params.id);

    return res.status(HTTP_CODE.OK).json({
      success: true,
      ...result,
    });
  },
};
