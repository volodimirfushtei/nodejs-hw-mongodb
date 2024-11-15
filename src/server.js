import express from 'express';
import mongoose from 'mongoose';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { env } from './env.js';
import { getAllContacts, getContactById } from './db/services/contacts.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

export async function setupServer() {
  const app = express();
  const PORT = Number(env('PORT', '3000'));

  try {
    await initMongoConnection();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).send({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error('Error retrieving contacts:', error);
      res.status(500).send({
        message: 'Error retrieving contacts.',
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    const contact = await getContactById(contactId);
    if (contact === null) {
      return res.status(404).send({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).send({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  });
  app.use((req, res, next) => {
    res.status(404).send({
      message: 'Route not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

setupServer();
