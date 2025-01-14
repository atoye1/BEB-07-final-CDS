import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // EMAIL_SERVICE: Joi.string().required(),
  // EMAIL_AUTH_USER: Joi.string().required(),
  // EMAIL_AUTH_PASSWORD: Joi.string().required(),
  // EMAIL_BASE_URL: Joi.string().required().uri(),
  // JWT_SECRET: Joi.string().required(),
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DB: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.string().valid('true', 'false').required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
});
