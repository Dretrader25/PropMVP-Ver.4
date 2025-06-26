import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use the existing DATABASE_URL or construct from Supabase credentials
let DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  const supabaseUrl = process.env.SUPABASE_URL;
  
  if (!supabaseUrl) {
    console.error("DATABASE_URL or SUPABASE_URL must be set for database connection.");
    // Use a fallback connection for development
    DATABASE_URL = "postgresql://postgres:password@localhost:5432/propanalyzed";
  } else {
    // Extract project ref from Supabase URL for basic connection attempt
    const projectRef = supabaseUrl.replace('https://', '').replace('http://', '').split('.')[0];
    DATABASE_URL = `postgresql://postgres:temp@db.${projectRef}.supabase.co:5432/postgres`;
    console.log("Using constructed Supabase connection string");
  }
}

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });