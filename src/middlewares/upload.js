import multer from 'multer';
import path from 'node:path';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, path.resolve('tmp'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + '-' + Math.round(Math.random() * 1e9) + file.originalname,
    );
  },
});

const upload = multer({ storage });
export { upload };
