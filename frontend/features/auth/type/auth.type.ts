// ============================================================
// Auth Types
// ============================================================

export interface Admin {
  id: string;
  username: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

/**
 * Format return value Server Action.
 *
 * Server Action tidak bisa throw AppError langsung ke client
 * karena melewati batas server→client. Semua error harus
 * di-serialize ke plain object terlebih dahulu.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | {
      success: false;
      message: string;
      code: string;
      /** Field-level validation errors untuk ditampilkan di form */
      validationErrors?: Record<string, string>;
    };
