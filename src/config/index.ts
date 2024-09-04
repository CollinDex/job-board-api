import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT ?? 8000,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  BASE_URL: process.env.BASE_URL,
  "api-prefix": "api/v1",
  TOKEN_SECRET: process.env.AUTH_SECRET,
  TOKEN_EXPIRY: process.env.AUTH_EXPIRY,
  SWAGGER_JSON_URL: process.env.SWAGGER_JSON_URL,
};

export default config;