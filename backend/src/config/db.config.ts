import mongoose from 'mongoose';
import { loadEnv } from './env';

export const connectDb = async (): Promise<void> => {
  const env = loadEnv();
  try {
    const uri = env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI must be defined in environment');
    }

    console.log('🔄 Connecting to MongoDB...');

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // gagal dalam 5 detik kalau tidak bisa konek
      connectTimeoutMS: 10000,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('🔌 Koneksi MongoDB ditutup');
};
