import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
  dotenv.config();
}

const connectionString = process.env.DATABASE_URL || 'postgres://fyn_user:fyn_password_local@localhost:5432/fyn_db';
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
