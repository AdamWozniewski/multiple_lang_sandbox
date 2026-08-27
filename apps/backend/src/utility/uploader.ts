import sanitize from 'sanitize-filename'
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import type { Request, RequestHandler, Response } from "express";
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
  else return cb(new Error('Dozwolone są tylko pliki graficzne (jpg, png, gif)'));
};
export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter
});

export const profileUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "bgc", maxCount: 1 },
]);

export const companyImageUpload = upload.single("image");

export const runImageMiddleware = (
  middleware: RequestHandler,
  req: Request,
  res: Response,
): Promise<void> =>
  new Promise((resolve, reject) => {
    middleware(req, res, (err) => (err ? reject(err) : resolve()));
  });
