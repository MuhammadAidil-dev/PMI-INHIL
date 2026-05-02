'use client';

import { ApiResult } from '@/lib/api/api-client';
import { AppError } from '@/lib/errors/error';
import { useState, useCallback } from 'react';
import { HandleErrorOptions, useApiError } from './useApiError';

// ============================================================
// useAsync: Wrapper untuk operasi async dengan loading & error state
// ============================================================

export interface AsyncState<T> {
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
}

export interface UseAsyncReturn<T> extends AsyncState<T> {
  /**
   * execute: jalankan fungsi async, kelola loading & error otomatis.
   * Return ApiResult agar caller tetap bisa cek { data, error }.
   */
  execute: (
    fn: () => Promise<ApiResult<T>>,
    options?: HandleErrorOptions,
  ) => Promise<ApiResult<T>>;
  /** Reset state ke initial (data=null, error=null, isLoading=false) */
  reset: () => void;
}

const INITIAL_STATE = <T>(): AsyncState<T> => ({
  data: null,
  error: null,
  isLoading: false,
});

export const useAsync = <T = unknown>(): UseAsyncReturn<T> => {
  const [state, setState] = useState<AsyncState<T>>(INITIAL_STATE<T>());
  const { handleError } = useApiError();

  const execute = useCallback(
    async (
      fn: () => Promise<ApiResult<T>>,
      options?: HandleErrorOptions,
    ): Promise<ApiResult<T>> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const result = await fn();

      if (result.error) {
        const appError = handleError(result.error, options);
        setState({ data: null, error: appError, isLoading: false });
        return { data: null, error: appError };
      }

      setState({ data: result.data, error: null, isLoading: false });
      return { data: result.data, error: null };
    },
    [handleError],
  );

  const reset = useCallback(() => {
    setState(INITIAL_STATE<T>());
  }, []);

  return { ...state, execute, reset };
};
