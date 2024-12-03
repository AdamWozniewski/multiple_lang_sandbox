import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';

const { Pool } = pkg;
const client = new Pool({
  connectionString: 'postgresql://admin:admin@localhost:5432/postgres',
});
export const db = drizzle({ client });
