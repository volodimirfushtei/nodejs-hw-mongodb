import { getContactById } from '../db/services/contacts.js';
import createHttpError from 'http-errors';

export async function checkContactByUser(contactId, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    throw createHttpError(
      404,
      "Contact not found or doesn't belong to his user",
    );
  }
  return contact;
}
