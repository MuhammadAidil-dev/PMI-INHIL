import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware';
import auhtRouter from './modules/auth/auth.route';
import { loadEnv } from './config/env';
import bloodStockRouter from './modules/bloodStock/bloodStock.route';
import { AppError } from './common/error/appError';
import { ERROR_CODE, HTTP_CODE } from './common/error/httpCode';
import donorRouter from './modules/donor/donor.route';
import transactionRouter from './modules/transactions/transaction.route';
import {
  scheduleAdminRouter,
  schedulePublicRouter,
} from './modules/schedule/schedule.route';
import newsRouter from './modules/news/news.route';
import notificationRouter from './modules/notifications/notification.route';

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
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// route
app.use('/api/v1/auth', auhtRouter);
app.use('/api/v1/blood-stocks', bloodStockRouter);
app.use('/api/v1/donors', donorRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/admin/schedules', scheduleAdminRouter);
app.use('/api/v1/public/schedules', schedulePublicRouter);
app.use('/api/v1/news', newsRouter);
app.use('/api/v1/notifications', notificationRouter);

// not found error
app.use((_req, _res, next) => {
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
