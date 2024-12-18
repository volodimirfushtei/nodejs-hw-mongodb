import { getAllContacts, getContactById } from '../db/services/contacts.js';
import { createContact } from '../db/services/contacts.js';
import { deleteContact } from '../db/services/contacts.js';
import { updateContact } from '../db/services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

import { uploadToCloudinaryStorage } from '../utils/uploadToCloudinary.js';
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
export async function getContactsByIdController(req, res, next) {
  const { _id } = req.params;

  const contact = await getContactById(_id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${_id}`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  let photo = null;

  // Перш ніж працювати з multer, перевіримо, чи файл існує у запиті

  try {
    // Якщо фото є, перевіримо, куди його завантажити
    if (typeof req.file !== 'undefined') {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        // Завантажуємо фото в Cloudinary, якщо це увімкнено
        const result = await uploadToCloudinaryStorage(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url; // Отримуємо URL після завантаження
      } else {
        await fs.rename(
          req.file.path,
          path.resolve('src', 'public', 'photos', req.file.filename),
        );
        photo = `http://localhost:3000/photos/${req.file.filename}`;
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
    const createdContact = await createContact(contact);
    if (!createdContact) {
      return res.status(400).send({ message: 'Invalid contact data' });
    }
    res.status(201).send({
      status: 201,
      message: 'Successfully created a contact!',
      data: createdContact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
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
    try {
      if (process.env.ENABLE_CLOUDINARY === 'true') {
        const result = await uploadToCloudinaryStorage(req.file.path);
        await fs.unlink(req.file.path);
        photo = result.secure_url;
      } else {
        const photoPath = path.resolve(
          'src',
          'public',
          'photos',
          req.file.filename,
        );
        await fs.rename(req.file.path, photoPath);
        photo = `http://localhost:3000/photos/${req.file.filename}`;
      }
    } catch (error) {
      console.error(error);
      return next(createHttpError(500, 'Error uploading photo'));
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
