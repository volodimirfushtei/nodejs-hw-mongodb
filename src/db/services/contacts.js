import { MyContacts } from '../models/contacts.js';

export const getAllContacts = async () => {
  const allContacts = await MyContacts.find();
  return allContacts;
};

export async function getContactById(contactId) {
  try {
    const contact = await MyContacts.findById(contactId);
    return contact;
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw new Error('Error fetching contact');
  }
}
