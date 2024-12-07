import { registerUser, loginUser } from '../db/services/auth.js';

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
  await loginUser(email, password);
  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
  });
}
