import app from './app';
import { connectDb } from './config/db.config';
import { loadEnv } from './config/env';
import { startNotificationScheduler } from './modules/notifications/notification.schedule';

const startServer = async (): Promise<void> => {
  try {
    const env = loadEnv();

    await connectDb();

    startNotificationScheduler();
    app.listen(env.PORT, () => {
      console.log(`Server running on ${env.URL}`);
    });
  } catch (error) {
    console.log('Failed to running server', error);
    process.exit(1);
  }
};

startServer();
