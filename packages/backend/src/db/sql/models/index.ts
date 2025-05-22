import { boolean, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable("user", {
  id: serial("id").primaryKey().notNull().unique(),
  email: varchar("email").notNull().unique(),
  lastName: varchar("lastName"),
  firstName: varchar("firstName"),
  password: varchar("password").notNull(),
  roles: varchar("roles").notNull(),
  avatar: varchar("avatar"),
  activate: boolean("activate").notNull(),
  apiToken: varchar("apiToken").notNull(),
});
// _id: Types.ObjectId;
// id: string;
// email: string;
// password: string;
// avatar?: string;
// firstName?: string;
// lastName?: string;
// apiToken?: string;
// activate: boolean;
// roles: ObjectId | IUserRole;