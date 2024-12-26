import { getAllContacts, getContactById } from '../db/services/contacts.js';
import { createContact } from '../db/services/contacts.js';
import { deleteContact } from '../db/services/contacts.js';
import { updateContact } from '../db/services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';

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
    userId: req.user.id,
  });
  if (contacts.length === 0) {
    throw createHttpError(404, 'No contacts found');
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}
export async function getContactsByIdController(req, res) {
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
  console.log('Received request:', req.body);

  let photo = null;
  if (req.file) {
    const tmpFilePath = req.file.path;

    try {
      console.log('File path:', tmpFilePath);

      if (process.env.ENABLE_CLOUDINARY === 'true') {
        console.log('Uploading file to Cloudinary:', tmpFilePath);
        const cloudinaryResult = await uploadToCloudinary(tmpFilePath);
        console.log('Cloudinary upload result:', cloudinaryResult);

        photo = cloudinaryResult.secure_url;
      } else {
        const targetPath = path.resolve('public', 'photos', req.file.filename);
        await fs.rename(tmpFilePath, targetPath);
        photo = `http://localhost:3000/photos/${req.file.filename}`;
      }
      await fs.unlink(tmpFilePath);
      console.log('Temporary file deleted:', tmpFilePath);
    } catch (error) {
      console.error('Error during file upload or processing:', error);
      return res.status(500).send({
        message: 'Failed to upload or process the photo',
        error: error.message,
      });
    }
  }
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user.id,
    photo,
  };

  try {
    const result = await createContact(contact);
    res.status(201).send({
      status: 201,
      message: 'Contact created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).send({
      status: 500,
      message: 'An error occurred while creating the contact',
      error: error.message,
    });
  }
}

export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const userId = req.user.id;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    throw createHttpError(
      404,
      "Contact not found or doesn't belong to this user",
    );
  }

  const deletedContact = await deleteContact(contactId);
  if (deletedContact === null) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send({
    status: 204,
    message: `Successfully deleted contact with id ${contactId}`,
  });
  console.log(`Deleted contact with id ${contactId}`);
}

export async function patchContactController(req, res, next) {
  const { contactId } = req.params;
  const userId = req.user.id;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const contact = await getContactById(contactId, userId);
  if (!contact) {
    throw createHttpError(
      404,
      "Contact not found or doesn't belong to this user",
    );
  }

  const updatedContactData = {};
  if (name !== undefined) updatedContactData.name = name;
  if (phoneNumber !== undefined) updatedContactData.phoneNumber = phoneNumber;
  if (email !== undefined) updatedContactData.email = email;
  if (isFavourite !== undefined) updatedContactData.isFavourite = isFavourite;
  if (contactType !== undefined) updatedContactData.contactType = contactType;

  let photo = contact.photo;

  if (req.file) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      const photoPath = path.resolve('public', 'photos', req.file.filename);
      await fs.rename(req.file.path, photoPath);
      photo = `http://localhost:3000/photos/${req.file.filename}`;
    }
  }

  updatedContactData.photo = photo;
  const updatedContact = await updateContact(contactId, updatedContactData);
  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}
