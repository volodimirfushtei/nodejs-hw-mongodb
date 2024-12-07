import { registerUser, loginUser, logoutUser } from '../db/services/auth.js';

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
  const sessionId = res.cookies;
  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.send(204).end();
}
