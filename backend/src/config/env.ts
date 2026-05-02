import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${nodeEnv}` });

const getEnv = (param: string): string => {
  const value = process.env[param];
  if (!value) {
    throw new Error(
      `Environment variable ${param} is required to run the server`,
    );
  }
  return value.trim();
};

export const loadEnv = () => {
  const port = Number(getEnv('PORT'));
  if (Number.isNaN(port)) {
    throw new Error('Environment variable PORT must be a valid number');
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: port,
    MONGO_URI: getEnv('MONGO_URI'),
    URL: getEnv('URL'),
    SECRET_KEY: getEnv('SECRET_KEY'),
    SECRET_KEY_REFRESH_TOKEN: getEnv('SECRET_KEY_REFRESH_TOKEN'),
    JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),
    CLIENT_URL: getEnv('CLIENT_URL'),
    FONNTE_TOKEN: getEnv('FONNTE_TOKEN'),
    FONNTE_API_URL: getEnv('FONNTE_API_URL'),
  };
};

export const loadAdminEnv = () => ({
  ALLOW_SEEDER_ADMIN: getEnv('ALLOW_SEEDER_ADMIN'),
  ADMIN_PHONE_NUMBER: getEnv('ADMIN_PHONE_NUMBER'),
  ADMIN_EMAIL: getEnv('ADMIN_EMAIL'),
  ADMIN_PASSWORD: getEnv('ADMIN_PASSWORD'),
});
