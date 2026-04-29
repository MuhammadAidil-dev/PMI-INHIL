import { Request, Response, NextFunction } from 'express';
import { LoginPayload, loginSchema } from './auth.validation';
import { authService } from './auth.service';
import { HTTP_CODE } from '@/common/error/httpCode';

const COOKIE_NAME = 'access_token';

const eightHours = 8 * 60 * 60 * 1000; // 8 jam dalam milidetik (sesuaikan dengan JWT_EXPIRES_IN)

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: eightHours,
  path: '/',
};

/**
 * POST /api/v1/auth/login
 *
 * Request Body:
 * {
 *   "identifier": "admin" | "admin@pmi.com",
 *   "password": "********"
 * }
 */
export const login = async (_req: Request, res: Response): Promise<void> => {
  const payload = res.locals.body as LoginPayload;

  const { admin, token } = await authService.login(payload);

  res.cookie(COOKIE_NAME, token, cookieOptions);

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Login berhasil',
    data: {
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    },
  });
};

/**
 * POST /api/v1/auth/logout
 * Hapus cookie dengan mengirim cookie kosong yang langsung expired.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie(COOKIE_NAME, { path: '/' });

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Logout berhasil',
  });
};

/**
 * GET /api/v1/auth/me
 * Mendapatkan data admin yang sedang login (butuh middleware auth).
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  // req.admin diset oleh middleware authenticate
  const admin = (req as any).admin;

  res.status(HTTP_CODE.OK).json({
    success: true,
    message: 'Data admin berhasil diambil',
    data: { admin },
  });
};
