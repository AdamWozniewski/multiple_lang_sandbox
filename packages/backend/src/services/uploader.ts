import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { __dirname } from "./dirname.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = path.join(__dirname(import.meta.url), '../../public/img/uploads/');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    const name = `${Date.now()}_${file.originalname}`;
    cb(null, name);
  },
});
export const upload = multer({
  storage,
});