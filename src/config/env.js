import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT) || 3000,

  MONGO_URI: process.env.MONGO_URI,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB),
  BATCH_SIZE: Number(process.env.BATCH_SIZE),
  CACHE_TTL_SECONDS: Number(process.env.CACHE_TTL_SECONDS),
  IMPORT_ERRORS_CAP: Number(process.env.IMPORT_ERRORS_CAP),
};