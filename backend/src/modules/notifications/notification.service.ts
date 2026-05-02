import { Types } from 'mongoose';
import { AppError } from '@/common/error/appError';
import { ERROR_CODE, HTTP_CODE } from '@/common/error/httpCode';
import { donorRepository } from '@/modules/donor/donor.repository';
import { notificationRepository } from './notification.repository';
import {
  BulkSendResult,
  NotificationResponse,
  NotificationStatus,
  NotificationTrigger,
  NotificationType,
  PaginatedNotificationResponse,
  QueryNotificationDto,
  SendManualNotificationDto,
} from './notification.type';
import { INotification } from './notification.type';
import { fonnteClient } from '@/common/utils/fonteClient';

// ── Template pesan ────────────────────────────────────────────────────────────

/**
 * Template pesan untuk pengingat donor (eligible reminder).
 * Admin bisa override dengan pesan custom juga.
 */
export function buildEligibleReminderMessage(donorName: string): string {
  return (
    `Assalamu'alaikum *${donorName}*! 🩸\n\n` +
    `Sudah 90 hari sejak donor terakhir Anda. Anda kini *sudah bisa mendonorkan darah kembali*!\n\n` +
    `Darah Anda sangat berarti bagi mereka yang membutuhkan. Yuk, luangkan waktu untuk mendonorkan darah di *UDD PMI Kabupaten Indragiri Hilir*.\n\n` +
    `📍 Lokasi: Jl. PMI, Tembilahan\n` +
    `🕗 Jam layanan: Senin–Sabtu, 08.00–14.00 WIB\n\n` +
    `_Terima kasih atas kebaikan Anda!_ 🙏\n` +
    `*PMI Kabupaten Indragiri Hilir*`
  );
}

export function buildPostDonationMessage(
  donorName: string,
  nextDate: string,
): string {
  return (
    `Assalamu'alaikum *${donorName}*! 🩸\n\n` +
    `Terima kasih telah mendonorkan darah hari ini! Setiap tetes darah Anda sangat berarti. ❤️\n\n` +
    `Untuk menjaga kesehatan Anda, donor darah berikutnya dapat dilakukan mulai:\n` +
    `📅 *${nextDate}*\n\n` +
    `Kami akan mengingatkan Anda kembali saat waktunya tiba.\n\n` +
    `_Salam sehat,_\n` +
    `*PMI Kabupaten Indragiri Hilir*`
  );
}

// ── Helper: format ────────────────────────────────────────────────────────────

function formatNotification(n: INotification): NotificationResponse {
  return {
    id: n._id.toString(),
    donorId: n.donorId.toString(),
    donorName: n.donorName,
    phone: n.phone,
    message: n.message,
    type: n.type,
    trigger: n.trigger,
    status: n.status,
    errorMessage: n.errorMessage ?? undefined,
    sentAt: n.sentAt?.toISOString() ?? null,
    createdAt: n.createdAt.toISOString(),
  };
}

// ── Core: kirim satu notifikasi via Fonnte ─────────────────────────────────────

async function dispatchSingle(params: {
  donorId: Types.ObjectId | string;
  donorName: string;
  phone: string;
  message: string;
  type: NotificationType;
  trigger: NotificationTrigger;
}): Promise<NotificationResponse> {
  // 1. Buat record log dulu (status: pending)
  const record = await notificationRepository.create(params);

  try {
    // 2. Kirim via Fonnte
    const fonnteRes = await fonnteClient.send({
      target: params.phone,
      message: params.message,
    });

    if (!fonnteRes.status) {
      // Fonnte merespons tapi pengiriman gagal
      const errMsg = fonnteRes.message ?? 'Fonnte: pengiriman gagal';
      await notificationRepository.markFailed(record._id, errMsg);
      return formatNotification(
        (await notificationRepository.markFailed(record._id, errMsg))!,
      );
    }

    // 3. Tandai sukses
    const updated = await notificationRepository.markSent(
      record._id,
      JSON.stringify(fonnteRes),
    );

    // 4. Update timestamp di donor agar tidak dikirim lagi terlalu cepat
    await donorRepository.markNotificationSent(params.donorId);

    return formatNotification(updated!);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    const updated = await notificationRepository.markFailed(record._id, errMsg);
    return formatNotification(updated!);
  }
}

// ── Service ───────────────────────────────────────────────────────────────────

export const notificationService = {
  // ── Kirim manual (bulk) ──────────────────────────────────────────────────

  /**
   * Admin memilih daftar pendonor dan menulis pesan custom.
   * Bisa kirim ke 1 atau banyak pendonor sekaligus.
   */
  async sendManual(dto: SendManualNotificationDto): Promise<BulkSendResult> {
    if (!dto.donorIds.length) {
      throw new AppError(
        'Minimal satu pendonor harus dipilih',
        HTTP_CODE.BAD_REQUEST,
        ERROR_CODE.NOT_FOUND,
      );
    }

    const results: BulkSendResult['results'] = [];
    let success = 0;
    let failed = 0;

    for (const donorId of dto.donorIds) {
      const donor = await donorRepository.findById(donorId);
      if (!donor || !donor.isActive) {
        results.push({
          donorId,
          donorName: '-',
          phone: '-',
          status: NotificationStatus.FAILED,
          errorMessage: 'Pendonor tidak ditemukan atau tidak aktif',
        });
        failed++;
        continue;
      }

      const result = await dispatchSingle({
        donorId: donor._id,
        donorName: donor.fullName,
        phone: donor.phone,
        message: dto.message,
        type: NotificationType.CUSTOM,
        trigger: NotificationTrigger.MANUAL,
      });

      results.push({
        donorId: result.donorId,
        donorName: result.donorName,
        phone: result.phone,
        status: result.status,
        errorMessage: result.errorMessage,
      });

      if (result.status === NotificationStatus.SENT) success++;
      else failed++;
    }

    return { total: dto.donorIds.length, success, failed, results };
  },

  // ── Kirim pengingat terjadwal (cron) ──────────────────────────────────────

  /**
   * Dipanggil oleh scheduler setiap hari.
   * Mengambil semua pendonor yang sudah eligible dan belum dinotifikasi
   * dalam 30 hari terakhir, lalu kirim pesan pengingat otomatis.
   */
  async sendScheduledReminders(): Promise<BulkSendResult> {
    const eligibleDonors = await donorRepository.findEligibleForNotification();

    if (!eligibleDonors.length) {
      return { total: 0, success: 0, failed: 0, results: [] };
    }

    const results: BulkSendResult['results'] = [];
    let success = 0;
    let failed = 0;

    for (const donor of eligibleDonors) {
      const message = buildEligibleReminderMessage(donor.fullName);

      const result = await dispatchSingle({
        donorId: donor._id,
        donorName: donor.fullName,
        phone: donor.phone,
        message,
        type: NotificationType.ELIGIBLE_REMINDER,
        trigger: NotificationTrigger.SCHEDULED,
      });

      results.push({
        donorId: result.donorId,
        donorName: result.donorName,
        phone: result.phone,
        status: result.status,
        errorMessage: result.errorMessage,
      });

      if (result.status === NotificationStatus.SENT) success++;
      else failed++;
    }

    console.log(
      `[Scheduler] Notifikasi terkirim: ${success}/${eligibleDonors.length}`,
    );

    return {
      total: eligibleDonors.length,
      success,
      failed,
      results,
    };
  },

  // ── Kirim notifikasi pasca transaksi donor ────────────────────────────────

  /**
   * Dipanggil oleh transaksiService.create() setelah transaksi donor berhasil.
   * Mengirimkan ucapan terima kasih + jadwal donor berikutnya.
   */
  async sendPostDonationNotification(donorId: string): Promise<void> {
    const donor = await donorRepository.findById(donorId);
    if (!donor || !donor.isActive) return;

    const nextDate = donor.nextEligibleDate
      ? new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(donor.nextEligibleDate)
      : '-';

    const message = buildPostDonationMessage(donor.fullName, nextDate);

    await dispatchSingle({
      donorId: donor._id,
      donorName: donor.fullName,
      phone: donor.phone,
      message,
      type: NotificationType.POST_DONATION_THANKS,
      trigger: NotificationTrigger.POST_DONATION,
    });
  },

  // ── Preview pesan template ────────────────────────────────────────────────

  /**
   * Mengembalikan preview pesan template untuk ditampilkan di UI
   * sebelum admin mengirim.
   */
  getTemplates(): Record<string, string> {
    return {
      eligible_reminder: buildEligibleReminderMessage('[Nama Pendonor]'),
      post_donation_thanks: buildPostDonationMessage(
        '[Nama Pendonor]',
        '[Tanggal Berikutnya]',
      ),
    };
  },

  // ── Log & stats ───────────────────────────────────────────────────────────

  async getLogs(
    query: QueryNotificationDto,
  ): Promise<PaginatedNotificationResponse> {
    const { page = 1, limit = 20 } = query;
    const { data, total } = await notificationRepository.findAll(query);
    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map(formatNotification),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  async getLogsByDonor(donorId: string): Promise<NotificationResponse[]> {
    const data = await notificationRepository.findByDonorId(donorId);
    return data.map(formatNotification);
  },

  async getStats() {
    return notificationRepository.getStats();
  },
};
