import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Використовуємо асинхронну функцію для читання файлів
const readFileAsync = util.promisify(fs.readFile);

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export const swaggerDocs = async (req, res, next) => {
  try {
    // Асинхронно читаємо файл swagger.json
    const swaggerDoc = JSON.parse(await readFileAsync(SWAGGER_PATH, 'utf8'));

    // Повертаємо сервіс документації
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    console.error('Error loading Swagger docs:', err.message);
    // Якщо не вдалося завантажити документацію, повертаємо помилку 500
    return next(createHttpError(500, "Can't load swagger docs"));
  }
};
