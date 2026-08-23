import sanitize from 'sanitize-filename'
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { __dirname } from "./dirname";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dirPath = path.join(
      __dirname(import.meta.url),
      "../../public/img/uploads/",
    );
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    cb(null, dirPath);
  },
  filename: (_req: any, file, cb) => {
    const name = `${crypto.randomUUID()}_${Date.now()}_${sanitize(file.originalname)}`;
    cb(null, name);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) return cb(null, true);
  else cb(new Error('Only images are allowed!'));
};
export const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1000 * 1000
  },
  fileFilter
});
