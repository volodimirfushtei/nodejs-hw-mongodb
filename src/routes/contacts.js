// src/routers/students.js
import express from 'express';
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
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
const router = express.Router();
const jsonPars = express.json();
router.use(authenticate);
router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactsByIdController));
router.post(
  '/',
  upload.single('photo'),
  jsonPars,
  validateBody(contactSchema),
  ctrlWrapper(createContactController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.patch(
  '/:contactId',
  isValidId,
  jsonPars,
  validateBody(patchContactSchema),
  ctrlWrapper(patchContactController),
);
export default router;
