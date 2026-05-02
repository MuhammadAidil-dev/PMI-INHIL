// ============================================================
// Auth Service: operasi GET via apiClient (client-side)
// Untuk mutasi (login, logout) → gunakan Server Action
// ============================================================

import { apiClient, ApiResult } from '@/lib/api/api-client';
import { Admin } from '../type/auth.type';

export const authService = {
  /**
   * Ambil data admin yang sedang login (verify token aktif).
   * Dipanggil saat app mount untuk restore session.
   *
   * @example
   * const { data, error } = await authService.getMe();
   */
  getMe: (): Promise<ApiResult<Admin>> => apiClient.get<Admin>('/auth/me'),
};
