import { MyContacts } from '../models/contacts.js';

export async function getAllContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
  userId,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactQuery = MyContacts.find({ userId });

  if (filters) {
    contactQuery.where(filters || {});
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
    hasNextPage: totalItems > page * perPage,
    hasPreviousPage: page > 1,
  };
}

export async function getContactById(contactId, userId) {
  const contact = await MyContacts.findOne({ _id: contactId, userId });
  return contact;
}
export function createContact(contact) {
  return MyContacts.create(contact);
}
export function deleteContact(contactId) {
  return MyContacts.findByIdAndDelete(contactId);
}
export function updateContact(contactId, contact) {
  return MyContacts.findByIdAndUpdate(contactId, contact, { new: true });
}
