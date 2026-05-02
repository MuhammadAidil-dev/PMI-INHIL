import axios, { AxiosError } from 'axios';
import { AppError } from './error';
import type { ApiErrorResponse } from '@/types/api.type';

// ============================================================
// parseError: Konversi error apapun → AppError yang konsisten
// ============================================================

/**
 * Ambil pesan yang ramah pengguna berdasarkan HTTP status code.
 * Dipakai sebagai fallback jika backend tidak kirim message.
 */
const getDefaultMessage = (status: number): string => {
  const messages: Record<number, string> = {
    400: 'Data yang dikirim tidak valid. Periksa kembali isian Anda.',
    401: 'Sesi Anda telah berakhir. Silakan login kembali.',
    403: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
    404: 'Data yang dicari tidak ditemukan.',
    409: 'Data sudah ada. Gunakan data yang berbeda.',
    422: 'Data tidak dapat diproses. Periksa format yang dikirim.',
    429: 'Terlalu banyak permintaan. Coba lagi dalam beberapa saat.',
    500: 'Terjadi kesalahan pada server. Silakan coba lagi.',
    502: 'Server sedang tidak tersedia. Coba lagi nanti.',
    503: 'Layanan sedang dalam pemeliharaan. Coba lagi nanti.',
  };
  return messages[status] ?? `Terjadi kesalahan (${status}).`;
};

/**
 * parseError: terima nilai apapun (unknown) dari catch block
 * dan kembalikan AppError yang sudah terstruktur.
 *
 * Urutan pengecekan:
 * 1. Sudah AppError → return langsung
 * 2. AxiosError → parse dari response backend
 * 3. Error jaringan / timeout
 * 4. Error JS biasa
 * 5. Nilai non-Error (string, object, dll)
 */
export const parseError = (error: unknown): AppError => {
  // 1. Sudah AppError, langsung return
  if (error instanceof AppError) {
    return error;
  }

  // 2. AxiosError — error dari HTTP request
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;

    // Tidak ada response → network error / timeout / CORS
    if (!axiosErr.response) {
      const isTimeout = axiosErr.code === 'ECONNABORTED';
      return new AppError({
        message: isTimeout
          ? 'Koneksi timeout. Periksa koneksi internet Anda.'
          : 'Tidak dapat terhubung ke server. Periksa koneksi Anda.',
        statusCode: 0,
        code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        isNetworkError: true,
      });
    }

    const { status, data } = axiosErr.response;
    const backendMessage = data?.message;
    const backendCode = data?.code;
    const validationErrors = data?.errors;

    return new AppError({
      message: backendMessage ?? getDefaultMessage(status),
      statusCode: status,
      code: backendCode ?? `HTTP_${status}`,
      validationErrors,
      severity: status >= 500 ? 'error' : status === 401 ? 'warning' : 'error',
    });
  }

  // 3. Error JS biasa (TypeError, RangeError, dll)
  if (error instanceof Error) {
    return new AppError({
      message: error.message || 'Terjadi kesalahan yang tidak terduga.',
      code: error.name ?? 'JS_ERROR',
    });
  }

  // 4. String dilempar sebagai error
  if (typeof error === 'string') {
    return new AppError({ message: error, code: 'STRING_ERROR' });
  }

  // 5. Fallback untuk tipe lain (object, number, dll)
  return new AppError({
    message: 'Terjadi kesalahan yang tidak diketahui.',
    code: 'UNKNOWN_ERROR',
  });
};
