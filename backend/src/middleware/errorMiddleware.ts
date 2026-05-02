import { NextFunction, Request, Response } from 'express';
import { loadEnv } from '../config/env';
import { AppError } from '@/common/error/appError';
import { ERROR_CODE, ERROR_MESSAGE, HTTP_CODE } from '@/common/error/httpCode';

const env = loadEnv();

const hasNumericCode = (error: unknown): error is { code: number } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'number'
  );
};

const hasStack = (error: unknown): error is { stack: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'stack' in error &&
    typeof (error as { stack: unknown }).stack === 'string'
  );
};

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = HTTP_CODE.INTERNAL_SERVER;
  let message = ERROR_MESSAGE.SERVER.INTERNAL_SERVER;
  let code = ERROR_CODE.INTERNAL_SERVER;

  // handle custom error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  }

  // Handle Mongo duplicate key error
  if (hasNumericCode(err) && err.code === 11000) {
    statusCode = HTTP_CODE.CONFLICT;
    message = ERROR_MESSAGE.MONGO.DUPLICATE_KEY;
    code = ERROR_CODE.DUPLICATE_KEY;
  }

  // Logging
  if (env.NODE_ENV === 'development') {
    console.error('ERROR:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    code,
    // tampilkan stack trace hanya di development
    ...(env.NODE_ENV === 'development' &&
      hasStack(err) && { stack: err.stack }),
  });
};
