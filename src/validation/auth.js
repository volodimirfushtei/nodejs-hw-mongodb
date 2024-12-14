import Joi from 'joi';
export const usersSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
export const sessionSchema = Joi.object({
  userId: Joi.string().required(),
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
  accessTokenValidUntil: Joi.date().required(),
  refreshTokenValidUntil: Joi.date().required(),
});
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
