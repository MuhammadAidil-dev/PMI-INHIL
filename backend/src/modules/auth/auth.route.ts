import { Router } from 'express';
import { getMe, login, logout } from './auth.controller';
import { asyncHandler } from '@/common/utils/asyncHandler';
import { authenticate } from '@/middleware/authenticateMiddleware';
import { validate } from '@/middleware/validatePayload';
import { loginSchema } from './auth.validation';

const auhtRouter = Router();

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login admin
 * @access  Public
 */
auhtRouter.post('/login', validate(loginSchema), asyncHandler(login));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Login admin
 * @access  Public
 */
auhtRouter.post('/logout', authenticate, asyncHandler(logout));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Ambil data admin yang sedang login
 * @access  Private (butuh token)
 */
auhtRouter.get('/me', authenticate, asyncHandler(getMe));

export default auhtRouter;
