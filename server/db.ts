import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use the existing DATABASE_URL or construct from Supabase credentials
let DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  const supabaseUrl = process.env.SUPABASE_URL;
  
  if (!supabaseUrl) {
    throw new Error(
      "DATABASE_URL or SUPABASE_URL must be set for database connection.",
    );
  }

  // For Supabase, the user needs to provide the connection string from their dashboard
  // This should be the "Connection string" from the Supabase project settings
  throw new Error(
    "Please provide the DATABASE_URL from your Supabase project settings. Go to Settings > Database > Connection string and use the URI format."
  );
}

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });