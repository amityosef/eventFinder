import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  CORS_ORIGIN: Joi.string().default('http://localhost:5173'),

  // Database
  MONGODB_URI: Joi.string().default('mongodb://localhost:27017/eventfinder'),
  MONGODB_DB_NAME: Joi.string().default('eventfinder'),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Google OAuth (optional)
  GOOGLE_CLIENT_ID: Joi.string().optional(),

  // AWS S3 (optional)
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().default('eu-west-1'),
  AWS_S3_BUCKET: Joi.string().optional(),

  // Mail
  MAIL_HOST: Joi.string().default('smtp.gmail.com'),
  MAIL_PORT: Joi.number().default(587),
  MAIL_USER: Joi.string().optional(),
  MAIL_PASS: Joi.string().optional(),
  MAIL_FROM: Joi.string().optional(),

  // AI
  OPENAI_API_KEY: Joi.string().optional(),
  GEMINI_API_KEY: Joi.string().optional(),
  AI_PROVIDER: Joi.string().valid('openai', 'gemini').default('openai'),

  // Elasticsearch
  ELASTICSEARCH_NODE: Joi.string().default('http://localhost:9200'),
  ELASTICSEARCH_INDEX: Joi.string().default('eventfinder-logs'),

  // Throttle
  THROTTLE_TTL: Joi.number().default(60000),
  THROTTLE_LIMIT: Joi.number().default(100),
});
