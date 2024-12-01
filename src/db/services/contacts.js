import { MyContacts } from '../models/contacts.js';

export async function getAllContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactQuery = MyContacts.find();

  if (filters) {
    contactQuery.where(filters);
  }

  const [totalItems, contacts] = await Promise.all([
    MyContacts.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: totalItems - page > 0,
    hasPreviousPage: page > 1,
  };
}

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
