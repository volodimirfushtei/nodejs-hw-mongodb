import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
export async function registerUser(payload) {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser !== null) {
    throw createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }
  return user;
}
