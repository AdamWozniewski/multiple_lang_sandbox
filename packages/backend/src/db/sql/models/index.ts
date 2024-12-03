// import { userTable } from './user.ts';
// // import './photo.ts';
// // import './course.ts';
//
// export const schema = {
//     userTable,
//     // photoTable,
//     // courseTable,
// };

import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable('user', {
  id: serial('id').primaryKey().notNull().unique(),
  email: varchar('email').notNull().unique(),
  lastName: varchar('lastName'),
  firstName: varchar('firstName'),
  password: varchar('password').notNull(),
});
