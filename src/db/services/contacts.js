import { MyContacts } from '../models/contacts.js';

export const getAllContacts = async () => {
  const allContacts = await MyContacts.find();
  return allContacts;
};

export async function getContactById(contactId) {
  const contact = await MyContacts.findById(contactId);
  return contact;
}
export function createContact(contact) {
  return MyContacts.create(contact);
}
export function deleteContact(contactId) {
  return MyContacts.findByIdAndDelete(contactId);
}
export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await MyContacts.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
