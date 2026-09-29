import {MulterOptions} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import {HttpException, HttpStatus} from "@nestjs/common";
import {existsSync, mkdir} from "node:fs";
import {mkdirSync} from "fs";
import {generateFileHash} from "vitest/node";

export const multerOptions: MulterOptions = {
    limits: {
        fileSize: 5242880,
    },
    fileFilter(
        req: Request,
        file: Express.Multer.File,
        done: (error: Error, acceptFile: boolean) => void,
    ) {
        if(file.mimetype.match(/\/(jpg|png|jpeg|gif)$/)) {
            done(null, true)
        } else {
            done(
                new HttpException(
                    `unsupported file type ${extname(file.originalname)}`,
                    HttpStatus.BAD_REQUEST
                ),
                false
            )
        }
    },
    storage: diskStorage({
        destination(
            req: Request,
            file: Express.Multer.File,
            done: (error: Error | null, filename: string) => void
        ) {
            const uploadPath = process.env.UPLOAD_TEMP_DIR
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath)
            }

            done(null, uploadPath)
        },
        filename(
            req: Request,
            file: Express.Multer.File,
            done: (error: Error | null, filename: string) => void
        ) {
            done(null, generateFileName(file.originalname))
        }
    })
}