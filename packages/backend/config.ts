import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    db: process.env.DATABASE || `mongodb://admin:example@127.0.0.1:27017/node?authSource=admin`,

}