// ============================================================
// Auth Service: operasi GET via apiClient (client-side)
// Untuk mutasi (login, logout) → gunakan Server Action
// ============================================================

import { apiClient, ApiResult } from '@/lib/api/api-client';
import { Admin, LoginPayload, LoginResponse } from '../type/auth.type';
import { apiServerClient } from '@/lib/api/api-server-client';

export const authService = {
  /**
   * Ambil data admin yang sedang login (verify token aktif).
   * Dipanggil saat app mount untuk restore session.
   *
   * @example
   * const { data, error } = await authService.getMe();
   */
  getMe: (): Promise<ApiResult<Admin>> => apiClient.get<Admin>('/auth/me'),

  loginService: async (
    payload: LoginPayload,
  ): Promise<ApiResult<LoginResponse>> => {
    return apiServerClient.post('/api/v1/auth/login', payload);
  },
};
