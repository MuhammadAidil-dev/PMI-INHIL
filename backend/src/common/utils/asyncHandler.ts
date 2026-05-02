import { NextFunction, RequestHandler, Request, Response } from 'express';

/**
 * asyncHandler: wrapper untuk menangkap error async
 * dan meneruskannya ke Express error handler (next).
 */
export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
