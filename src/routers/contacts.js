// src/routers/students.js
import express from 'express';
import { Router } from 'express';
import {
  getContactsController,
  getContactsByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId .js';

import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../validation/contact.js';
import { patchContactSchema } from '../validation/contact.js';
const router = Router();
const jsonPars = express.json();
router.get('/contacts', ctrlWrapper(getContactsController));
router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactsByIdController),
);
router.post(
  '/contacts',
  jsonPars,
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);
router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);
router.patch(
  '/contacts/:contactId',
  isValidId,
  jsonPars,
  validateBody(patchContactSchema),
  ctrlWrapper(patchContactController),
);
export default router;
