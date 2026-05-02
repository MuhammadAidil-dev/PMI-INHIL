'use client';

import { AppError } from '@/lib/errors/error';
import { useErrorStore } from '@/lib/errors/error.store';
import { parseError } from '@/lib/errors/parse-error';
import { ValidationErrors } from '@/types/api.type';
import { useCallback } from 'react';

// ============================================================
// useApiError: Hook utama untuk menangani error di UI
// ============================================================

export interface HandleErrorOptions {
  /**
   * Jika true, error validasi (400) tetap di-push ke toast global.
   * Default: false — validasi ditangani via validationErrors saja.
   */
  showValidationToast?: boolean;
  /**
   * Callback khusus ketika ada error 401 (sesi habis).
   * Default: halaman akan redirect otomatis via interceptor.
   */
  onUnauthorized?: () => void;
}

export interface UseApiErrorReturn {
  /** Tangani error dari catch block atau AppError */
  handleError: (error: unknown, options?: HandleErrorOptions) => AppError;
  /** Push error manual ke toast global */
  pushError: (error: AppError) => void;
  /** Dismiss satu error dari toast */
  dismissError: (id: string) => void;
  /** Bersihkan semua error */
  clearErrors: () => void;
  /** Ambil pesan error untuk satu field dari validationErrors */
  getFieldError: (
    errors: ValidationErrors | undefined,
    field: string,
  ) => string | undefined;
}

export const useApiError = (): UseApiErrorReturn => {
  const { addError, dismissError, clearErrors } = useErrorStore();

  /**
   * handleError: titik masuk tunggal untuk semua error.
   * Konversi ke AppError, push ke store global (untuk toast),
   * lalu return AppError agar caller bisa pakai lebih lanjut.
   */
  const handleError = useCallback(
    (raw: unknown, options: HandleErrorOptions = {}): AppError => {
      const err = parseError(raw);

      const { showValidationToast = false, onUnauthorized } = options;

      // Panggil callback 401 jika ada
      if (err.isUnauthorized && onUnauthorized) {
        onUnauthorized();
      }

      // Jangan push ke toast global jika error validasi (sudah ditampilkan di form)
      // kecuali diminta eksplisit
      const shouldSkipToast = err.isValidation && !showValidationToast;

      if (!shouldSkipToast) {
        addError(err);
      }

      return err;
    },
    [addError],
  );

  /**
   * pushError: push AppError langsung ke toast (bypass parseError).
   * Berguna saat kamu sudah punya AppError dan hanya perlu menampilkannya.
   */
  const pushError = useCallback(
    (error: AppError) => {
      addError(error);
    },
    [addError],
  );

  /**
   * getFieldError: helper untuk ambil pesan error satu field.
   * Berguna di komponen form:
   *
   * const fieldMsg = getFieldError(appError.validationErrors, 'email');
   */
  const getFieldError = useCallback(
    (errors: ValidationErrors | undefined, field: string) => {
      return errors?.[field];
    },
    [],
  );

  return {
    handleError,
    pushError,
    dismissError,
    clearErrors,
    getFieldError,
  };
};
