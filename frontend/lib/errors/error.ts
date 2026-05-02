import { ValidationErrors } from '@/types/api.type';

// ============================================================
// AppError: Error kustom untuk semua kegagalan API
// ============================================================

export type ErrorSeverity = 'error' | 'warning' | 'info';

export class AppError extends Error {
  /** HTTP status code (misal 400, 401, 404, 500) */
  public readonly statusCode: number;
  /** Kode error string dari backend (misal "DUPLICATE_KEY_ERROR") */
  public readonly code: string;
  /** Keparahan error — dipakai UI untuk warna toast/alert */
  public readonly severity: ErrorSeverity;
  /** Field-level validation errors untuk form */
  public readonly validationErrors?: ValidationErrors;
  /** Apakah error ini berasal dari jaringan / timeout */
  public readonly isNetworkError: boolean;

  constructor({
    message,
    statusCode = 500,
    code = 'UNKNOWN_ERROR',
    severity = 'error',
    validationErrors,
    isNetworkError = false,
  }: {
    message: string;
    statusCode?: number;
    code?: string;
    severity?: ErrorSeverity;
    validationErrors?: ValidationErrors;
    isNetworkError?: boolean;
  }) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.severity = severity;
    this.validationErrors = validationErrors;
    this.isNetworkError = isNetworkError;

    // Perbaiki prototype chain untuk instanceof check
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /** Apakah error ini error validasi form (400) */
  get isValidation(): boolean {
    return this.statusCode === 400 && !!this.validationErrors;
  }

  /** Apakah user tidak terautentikasi (401) */
  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /** Apakah user tidak memiliki izin (403) */
  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /** Apakah resource tidak ditemukan (404) */
  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /** Apakah error server (5xx) */
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}
