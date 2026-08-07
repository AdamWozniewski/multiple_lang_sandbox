import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db.js";
import { userTable } from "./models/user.js";

export const initializeDatabase = async () => {
  try {
    console.log("Rozpoczynanie migracji...");

    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migracje zastosowane pomyślnie!");

    const [admin] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, "admin@example.com"));

    if (!admin) {
      console.log("Tworzenie użytkownika admin...");
      await db.insert(userTable).values({
        name: "Admin",
        email: "admin@example.com",
        lastName: "User",
        firstName: "Admin",
        password: "hashed_password",
      });
      console.log("Użytkownik admin został dodany.");
    } else {
      console.log("Użytkownik admin już istnieje.");
    }
  } catch (error) {
    console.error("Błąd podczas inicjalizacji bazy danych:", error);
  }
};

export const runDBAdmin = async () => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.log(error);
  }
};
