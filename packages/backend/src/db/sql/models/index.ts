// import { userTable } from './user.js';
// // import './photo.ts';
// // import './course.ts';
//
// export const schema = {
//     userTable,
//     // photoTable,
//     // courseTable,
// };

import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
    id: serial('id').primaryKey().notNull().unique(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    lastName: text('lastName'),
    firstName: text('firstName'),
    password: text('password').notNull(),
});
