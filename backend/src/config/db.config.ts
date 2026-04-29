import mongoose from 'mongoose';

import { loadEnv } from './env';

export const connectDb = async (): Promise<void> => {
  const env = loadEnv();
  try {
    const uri = env.MONGO_URI;
    if (!uri) {
      throw new Error('Mongo uri must be defined');
    }

    await mongoose.connect(uri);
    console.log('Success to connect Mongo DB');
  } catch (error) {
    console.log('Mongo DB connection error', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('🔌 Koneksi MongoDB ditutup');
};
