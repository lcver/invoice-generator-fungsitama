import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq, ilike, or, sql, SQL } from 'drizzle-orm';
import * as schema from '@/drizzle/schema';

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL as string,
    connectionTimeoutMillis: 60000,
  },
  schema,
});
