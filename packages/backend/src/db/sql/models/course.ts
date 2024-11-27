import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const courseTable = pgTable('user', {
    id: serial('id').primaryKey().notNull().unique(),
    title: text('title').notNull(),
    desc: text('desc').notNull(),
});
