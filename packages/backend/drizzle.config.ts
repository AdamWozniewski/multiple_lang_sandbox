import {defineConfig} from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/sql/models/index.ts',
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: 'postgresql://admin:admin@localhost:5432/postgres'
    },
});