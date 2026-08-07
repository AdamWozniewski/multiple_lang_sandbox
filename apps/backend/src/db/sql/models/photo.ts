import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { courseTable } from "./course.js";

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courseTable.id),
  url: text("url").notNull(),
  description: text("description"),
});
