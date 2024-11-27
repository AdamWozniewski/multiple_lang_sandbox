import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
    id: serial('id').primaryKey().notNull().unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    avatar: text('avatar'),
    lastName: text('lastName'),
    firstName: text('firstName'),
    password: text('password').notNull(),
});
