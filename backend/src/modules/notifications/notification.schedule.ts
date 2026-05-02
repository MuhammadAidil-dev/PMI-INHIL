import cron from 'node-cron';
import { notificationService } from './notification.service';

/**
 * Scheduler untuk pengiriman notifikasi WhatsApp otomatis.
 *
 * Jadwal default: setiap hari pukul 08.00 WIB (01:00 UTC).
 * Format cron: '0 1 * * *'  →  menit=0, jam=1 UTC
 *
 * Mengambil semua pendonor yang:
 * - sudah eligible (nextEligibleDate <= hari ini)
 * - belum menerima notifikasi dalam 30 hari terakhir
 *
 * Lalu mengirimkan pesan pengingat via Fonnte WhatsApp API.
 */
export function startNotificationScheduler(): void {
  // Jalankan setiap hari pukul 08:00 WIB
  cron.schedule(
    '0 1 * * *',
    async () => {
      console.log('[Scheduler] Memulai pengiriman notifikasi terjadwal...');

      try {
        const result = await notificationService.sendScheduledReminders();

        console.log(
          `[Scheduler] Selesai. Total: ${result.total}, ` +
            `Berhasil: ${result.success}, Gagal: ${result.failed}`,
        );
      } catch (err) {
        console.error('[Scheduler] Error saat pengiriman notifikasi:', err);
      }
    },
    {
      timezone: 'Asia/Jakarta',
    },
  );

  console.log(
    '[Scheduler] Notifikasi terjadwal aktif — setiap hari pukul 08:00 WIB',
  );
}
