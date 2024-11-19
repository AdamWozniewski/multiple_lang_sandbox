import {fileURLToPath} from "url";
import path from "path";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dirPath = path.join(__dirname, '../../public/img/uploads/');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        cb(null, dirPath);
    },
    filename: (req, file, cb) => {
        const name = `${Date.now()}_${file.originalname}`;
        cb(null, name);
    }
})
export const upload = multer({
    storage
})