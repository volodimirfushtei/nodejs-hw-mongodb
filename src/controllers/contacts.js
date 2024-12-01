import { getAllContacts, getContactById } from '../db/services/contacts.js';
import { createContact } from '../db/services/contacts.js';
import { deleteContact } from '../db/services/contacts.js';
import { updateContact } from '../db/services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
export async function getContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = parseFilterParams(req.query);

  console.log({ sortBy, sortOrder });
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filters,
  });
  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}
export async function getContactsByIdController(req, res, next) {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
}
export async function createContactController(req, res) {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };
  const createdContact = await createContact(contact);
  if (createdContact === null) {
    throw createHttpError(400, 'Invalid contact data');
  }
  console.log(createdContact);
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
}
export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);
  if (deletedContact === null) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send({
    status: 204,
  });
  console.log(`Deleted contact with id ${contactId}`);
}
export async function patchContactController(req, res, next) {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const contact = {};

  if (name !== undefined) contact.name = name;
  if (phoneNumber !== undefined) contact.phoneNumber = phoneNumber;
  if (email !== undefined) contact.email = email;
  if (isFavourite !== undefined) contact.isFavourite = isFavourite;
  if (contactType !== undefined) contact.contactType = contactType;

  const updatedContact = await updateContact(contactId, contact);
  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).send({
    status: 200,
    message: `Successfully patched a contact!`,
    data: updatedContact.contact,
  });
}
