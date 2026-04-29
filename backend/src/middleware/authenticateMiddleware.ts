import { HTTP_CODE } from '@/common/error/httpCode';
import { loadEnv } from '@/config/env';
import { authRepository } from '@/modules/auth/auth.repository';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const env = loadEnv();

interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware untuk memproteksi route yang butuh autentikasi.
 * Memeriksa Bearer token dari header Authorization.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(HTTP_CODE.UNAUTHORIZED).json({
        success: false,
        message: 'Token tidak ditemukan. Silakan login terlebih dahulu',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.SECRET_KEY as string) as JwtPayload;

    // Verifikasi admin masih ada dan aktif di DB
    const admin = await authRepository.findById(decoded.sub);
    if (!admin || !admin.isActive) {
      res.status(HTTP_CODE.UNAUTHORIZED).json({
        success: false,
        message: 'Akun tidak ditemukan atau tidak aktif',
      });
      return;
    }

    // Attach data admin ke request
    (req as any).admin = admin;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(HTTP_CODE.UNAUTHORIZED).json({
        success: false,
        message: 'Sesi telah berakhir. Silakan login kembali',
      });
      return;
    }

    if (err instanceof jwt.JsonWebTokenError) {
      res.status(HTTP_CODE.UNAUTHORIZED).json({
        success: false,
        message: 'Token tidak valid',
      });
      return;
    }

    next(err);
  }
};

/**
 * Middleware untuk membatasi akses berdasarkan role.
 * Gunakan setelah middleware `authenticate`.
 *
 * Contoh: router.get('/dashboard', authenticate, authorize('superadmin'), handler)
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const admin = (req as any).admin;

    if (!roles.includes(admin.role)) {
      res.status(HTTP_CODE.FORBIDDEN).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk melakukan tindakan ini',
      });
      return;
    }

    next();
  };
};
