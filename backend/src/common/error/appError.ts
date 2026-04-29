import { ERROR_CODE, HTTP_CODE } from './httpCode';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = HTTP_CODE.INTERNAL_SERVER,
    code = ERROR_CODE.INTERNAL_SERVER,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
