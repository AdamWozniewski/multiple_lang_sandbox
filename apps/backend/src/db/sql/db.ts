import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { config } from '@config';

const { Pool } = pkg;
const client = new Pool({
  connectionString: config.db_sql,
});
export const db = drizzle({ client });
