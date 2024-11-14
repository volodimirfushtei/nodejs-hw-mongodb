// src/index.js

import express from 'express';
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
  await initMongoConnection();
  // Middleware
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
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error retrieving contacts.',
      });
    }
  });
  app.get('/contacts/:contactId', async (req, res, next) => {
    const contactId = req.params.contactId;

    try {
      const contact = await getContactById(contactId);
      if (contact) {
        res.json({
          status: 200,
          message: `Successfully found contact with id ${contactId}!`,
          data: contact,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'Contact not found',
        });
      }
    } catch (error) {
      next(error);
    }
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      message: 'Internal server error',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

setupServer();