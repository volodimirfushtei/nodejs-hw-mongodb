import multer from 'multer';
import path from 'node:path';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('src', 'public', 'photos')); // Вказуємо папку для фото
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Унікальне ім'я файлу
  },
});

// Ініціалізація multer
const upload = multer({ storage });
export { upload };
