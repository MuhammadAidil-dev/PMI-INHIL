import express, { Application } from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware';
import auhtRouter from './modules/auth/auth.route';
import { loadEnv } from './config/env';
import bloodStockRouter from './modules/bloodStock/bloodStock.route';
import { AppError } from './common/error/appError';
import { ERROR_CODE, HTTP_CODE } from './common/error/httpCode';

const env = loadEnv();

const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// route
app.use('/api/v1/auth', auhtRouter);
app.use('/api/v1/blood-stocks', bloodStockRouter);
// app.use('/api/users', userRoute);
// app.use('/api/branchs', branchRoute);

// not found error
app.use((req, res, next) => {
  next(
    new AppError(
      'Route not found',
      HTTP_CODE.NOT_FOUND,
      ERROR_CODE.INTERNAL_SERVER,
    ),
  );
});

// global error middleware
app.use(errorMiddleware);
export default app;
