import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import path from 'node:path';
import * as fs from 'node:fs';
import swaggerUI from 'swagger-ui-express';
dotenv.config();

export async function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  try {
    await initMongoConnection();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('docs/swagger.json'), 'utf-8'),
  );
  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      withCredentials: true,
      persistAuthorization: true,
    }),
  );
  app.use('/photos', express.static(path.resolve('public/photos')));

  app.use(cors({ credentials: true }));
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(routes);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
setupServer();
