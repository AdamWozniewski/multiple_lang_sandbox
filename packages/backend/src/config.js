import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    db: process.env.DATABASE || `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_ADDRESS}/${process.env.MONGO_DB_NAME}?authSource=admin`,
    secretSession: process.env.SESSION_SECRET || '',
    ssl: process.env.SSL || false,
    sessionSecret: process.env.SESSION_SECRET || ''
}