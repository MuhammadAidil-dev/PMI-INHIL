import { loadEnv } from '@/config/env';
import {
  FonntePayload,
  FonnteResponse,
} from '@/modules/notifications/notification.type';

const env = loadEnv();

const FONNTE_API_URL = env.FONNTE_API_URL;

/**
 * Normalise phone number ke format internasional tanpa '+'.
 * 08xxxxxx  → 628xxxxxx
 * 628xxxxxx → 628xxxxxx (tidak berubah)
 */
function normalisePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
  return cleaned;
}

/**
 * Kirim satu pesan WhatsApp via Fonnte.
 * Docs: https://fonnte.com/api
 *
 * Fonnte membutuhkan token device yang unik per akun.
 * Token disimpan di env: FONNTE_TOKEN
 */
export const fonnteClient = {
  async send(payload: FonntePayload): Promise<FonnteResponse> {
    const token = env.FONNTE_TOKEN;
    if (!token) {
      throw new Error('FONNTE_TOKEN tidak dikonfigurasi di environment');
    }

    const target = normalisePhone(payload.target);

    const formData = new URLSearchParams();
    formData.append('target', target);
    formData.append('message', payload.message);
    if (payload.countryCode) {
      formData.append('countryCode', payload.countryCode);
    }

    const response = await fetch(FONNTE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Fonnte HTTP ${response.status}: ${text}`);
    }

    const data = (await response.json()) as FonnteResponse;
    return data;
  },
};
