import express from 'express';
import { Router } from 'express';
import { usersSchema, loginSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { usersController, loginController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
const router = Router();
const jsonParser = express.json();
router.post(
  '/auth/register',
  jsonParser,
  validateBody(usersSchema),
  ctrlWrapper(usersController),
);

router.post(
  '/auth/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);
export default router;
