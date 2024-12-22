import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetPassword,
  resetPassword,
  loginOrRegister,
} from '../db/services/auth.js';
import { generateOauthUrl, validateCode } from '../utils/gooogleOAuth2.js';
import createHttpError from 'http-errors';
export async function usersController(req, res) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const user = await registerUser(payload);

  res.send({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}
export async function loginController(req, res) {
  const { email, password } = req.body;
  const session = await loginUser(email, password);

  if (!session) {
    throw new Error('Invalid email or password');
  }
  res.cookie('sessionId', session._id, {
    expires: session.refreshTokenValidUntil,
    httpOnly: true,
  });
  res.cookie('refreshToken', session.refreshToken, {
    expires: session.refreshTokenValidUntil,
    httpOnly: true,
  });
  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
}
export async function logoutController(req, res) {
  const sessionId = req.cookies;
  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.send(204).end();
}
export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;
  if (!sessionId || !refreshToken) {
    throw new Error('Missing session or refresh token');
  }
  const session = await refreshSession(sessionId, refreshToken);
  res.cookie('sessionId', session._id, {
    expires: session.refreshTokenValidUntil,
    httpOnly: true,
  });
  res.cookie('refreshToken', session.refreshToken, {
    expires: session.refreshTokenValidUntil,
    httpOnly: true,
  });
  res.send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
}

export const requestResetEmailController = async (req, res, next) => {
  const { email } = req.body;
  console.log({ email });
  try {
    const emailSent = await requestResetPassword(email);
    if (!emailSent) {
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    }
    res.send({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
export async function requestResetPasswordController(req, res) {
  const { password, token } = req.body;

  await resetPassword(password, token);
  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}

export async function getOAuthUrlController(req, res) {
  const url = generateOauthUrl();
  res.send({
    status: 200,
    message: 'Google OAuth URL has been generated.',
    data: url,
  });
}
export async function confirmOAuthController(req, res) {
  const { code } = req.body;
  const ticket = await validateCode(code);
  const session = await loginOrRegister(ticket.payload);
  res.cookie('sessionId', session._id, {
    expires: session.refreshTokenValidUntil,
    httpOnly: true,
  });
  res.cookie('refreshToken', session.refreshToken, {
    expires: session.refreshTokenValidUntil,
    httpOnly: true,
  });
  res.send({
    status: 200,
    message: 'Successfully authenticated with Google.',
    data: {},
  });
}
