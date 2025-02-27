import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/env"

import * as schema from '@/db/schema'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
export const db = drizzle({
    client: pool,
    schema: schema
});
