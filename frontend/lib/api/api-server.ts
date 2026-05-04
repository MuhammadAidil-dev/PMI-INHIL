// src/lib/api/api-client.server.ts
import { cookies } from 'next/headers';
import { AppError } from '../errors/error';
import { parseError } from '../errors/parse-error';
import { ApiResponse, RequestConfig } from '@/types/api.type';
import { COOKIE_KEYS } from '../cookies/cookies';

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: AppError };

const BASE_URL = process.env.API_URL ?? 'http://localhost:5000';

const serverFetch = async <T>(
  url: string,
  options: RequestInit = {},
  config?: RequestConfig,
): Promise<ApiResult<T>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_KEYS.AUTH_TOKEN)?.value;

    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      credentials: 'include',
    });

    const body: ApiResponse<T> = await response.json();

    if (!body.success) {
      return {
        data: null,
        error: new AppError({
          message: body.message ?? 'Permintaan gagal.',
          statusCode: response.status,
          code: body.code ?? 'LOGICAL_ERROR',
        }),
      };
    }

    return { data: body.data as T, error: null };
  } catch (raw) {
    return { data: null, error: parseError(raw) };
  }
};

export const apiServer = {
  get: <T>(url: string, config?: RequestConfig) =>
    serverFetch<T>(url, { method: 'GET' }, config),

  post: <T>(url: string, body?: unknown, config?: RequestConfig) =>
    serverFetch<T>(url, { method: 'POST', body: JSON.stringify(body) }, config),

  put: <T>(url: string, body?: unknown, config?: RequestConfig) =>
    serverFetch<T>(url, { method: 'PUT', body: JSON.stringify(body) }, config),

  patch: <T>(url: string, body?: unknown, config?: RequestConfig) =>
    serverFetch<T>(
      url,
      { method: 'PATCH', body: JSON.stringify(body) },
      config,
    ),

  delete: <T>(url: string, config?: RequestConfig) =>
    serverFetch<T>(url, { method: 'DELETE' }, config),
};
