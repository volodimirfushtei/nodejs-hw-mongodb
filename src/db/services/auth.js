import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
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

  await Session.deleteOne({ userId: user._id });
  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(16).toString('base64'),
    refreshToken: crypto.randomBytes(16).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}
export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token expired');
  }
  await Session.deleteOne({ _id: session._id });
  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(16).toString('base64'),
    refreshToken: crypto.randomBytes(16).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
export const requestResetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_CERT,
    {
      expiresIn: '2 days',
    },
  );
  console.log(`http//localhost:3000//reset-password?token=${resetToken}`);
};
export async function resetPassword(newPassword, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_CERT);
    console.log(decoded);
    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });
    if (user === null) {
      throw createHttpError(404, 'User not found');
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndDelete(
      { _id: user._id },
      { password: encryptedPassword },
    );
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Invalid token');
    }
  }
}
