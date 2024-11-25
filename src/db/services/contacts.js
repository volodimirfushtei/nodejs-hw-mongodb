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
  try {
    const rawResult = await MyContacts.findOneAndUpdate(
      { _id: contactId },
      { $set: payload },
      {
        new: true,
        returnDocument: 'after',
        runValidators: true,
        ...options,
      },
    );
    if (!rawResult) return null;
    const contactWithoutVersion = rawResult.toObject();
    delete contactWithoutVersion.__v;

    return {
      contact: contactWithoutVersion,
      isNew: Boolean(rawResult.upsertedId),
    };
  } catch (error) {
    throw new Error('Error updating contact: ' + error.message);
  }
};
