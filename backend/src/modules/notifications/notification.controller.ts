import { Request, Response } from 'express';
import { HTTP_CODE } from '@/common/error/httpCode';
import { notificationService } from './notification.service';
import {
  QueryNotificationDto,
  SendManualNotificationDto,
} from './notification.type';

export const notificationController = {
  /**
   * POST /notifications/send
   * Kirim notifikasi WA manual ke satu atau banyak pendonor.
   * Body: { donorIds: string[], message: string }
   */
  sendManual: async (req: Request, res: Response) => {
    const dto = res.locals.body as SendManualNotificationDto;
    const result = await notificationService.sendManual(dto);

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: `Notifikasi selesai diproses. Berhasil: ${result.success}, Gagal: ${result.failed}`,
      data: result,
    });
  },

  /**
   * POST /notifications/send-scheduled
   * Trigger manual untuk pengiriman notifikasi terjadwal.
   * Berguna untuk testing atau kirim ulang tanpa menunggu cron.
   * Hanya superadmin yang boleh akses (atur di route).
   */
  triggerScheduled: async (_req: Request, res: Response) => {
    const result = await notificationService.sendScheduledReminders();

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: `Pengiriman terjadwal selesai. Berhasil: ${result.success}/${result.total}`,
      data: result,
    });
  },

  /**
   * GET /notifications/logs
   * Riwayat semua notifikasi dengan filter & pagination.
   * Query: page, limit, donorId, status, type, trigger, startDate, endDate
   */
  getLogs: async (req: Request, res: Response) => {
    const query = req.query as unknown as QueryNotificationDto;
    const result = await notificationService.getLogs(query);

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil mengambil log notifikasi',
      data: result,
    });
  },

  /**
   * GET /notifications/logs/donor/:donorId
   * Riwayat notifikasi untuk satu pendonor tertentu.
   */
  getLogsByDonor: async (req: Request, res: Response) => {
    const { donorId } = req.params;
    const data = await notificationService.getLogsByDonor(donorId);

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil mengambil log notifikasi pendonor',
      data,
    });
  },

  /**
   * GET /notifications/stats
   * Statistik ringkasan: total, sent, failed, todaySent.
   */
  getStats: async (_req: Request, res: Response) => {
    const stats = await notificationService.getStats();

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil mengambil statistik notifikasi',
      data: stats,
    });
  },

  /**
   * GET /notifications/templates
   * Preview template pesan default (eligible_reminder, post_donation_thanks).
   * Membantu admin melihat format pesan sebelum mengirim.
   */
  getTemplates: async (_req: Request, res: Response) => {
    const templates = notificationService.getTemplates();

    return res.status(HTTP_CODE.OK).json({
      success: true,
      message: 'Berhasil mengambil template pesan',
      data: templates,
    });
  },
};
