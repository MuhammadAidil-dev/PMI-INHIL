// ============================================================
// TYPES: API Response & Error
// ============================================================

/**
 * Bentuk standar respons dari backend Express
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
}

/**
 * Bentuk respons validasi gagal (400)
 * Contoh: { identifier: "wajib diisi", password: "min 8 karakter" }
 */
export interface ValidationErrors {
  [field: string]: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: ValidationErrors;
  stack?: string; // hanya di development
}

/**
 * Tipe umum untuk pagination dari backend
 */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Konfigurasi tambahan per-request
 */
export interface RequestConfig {
  /** Jika true, error tidak akan di-throw; return null sebagai gantinya */
  silent?: boolean;
  /** Override base URL per-request */
  baseURL?: string;
}
