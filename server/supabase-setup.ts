import { Pool } from 'pg';

// Create database tables directly using SQL
export async function setupSupabaseTables() {
  // Extract project reference from Supabase URL
  const supabaseUrl = process.env.SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  
  if (!supabaseUrl || !dbPassword) {
    console.log('Supabase credentials not found, skipping table setup');
    return false;
  }

  const projectRef = supabaseUrl.replace('https://', '').replace('http://', '').split('.')[0];
  
  // Try multiple connection formats
  const connectionStrings = [
    `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`,
    `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`
  ];

  for (const connectionString of connectionStrings) {
    try {
      console.log(`Testing Supabase connection: ${connectionString.split('@')[1]}`);
      
      const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
        max: 1
      });

      // Test connection
      await pool.query('SELECT current_database()');
      console.log('✓ Supabase connection successful');

      // Create tables
      await createTables(pool);
      await pool.end();
      return true;

    } catch (error) {
      console.log(`✗ Connection failed: ${error.message}`);
      continue;
    }
  }

  console.log('All Supabase connection attempts failed');
  return false;
}

async function createTables(pool: Pool) {
  // Create properties table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      beds INTEGER,
      baths TEXT,
      sqft INTEGER,
      year_built INTEGER,
      property_type TEXT,
      lot_size TEXT,
      parking TEXT,
      has_pool BOOLEAN,
      hoa_fees TEXT,
      list_price TEXT,
      listing_status TEXT,
      days_on_market INTEGER,
      price_per_sqft TEXT,
      last_sale_price TEXT,
      last_sale_date TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create comparable_sales table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comparable_sales (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id),
      address TEXT NOT NULL,
      sale_price TEXT NOT NULL,
      beds INTEGER,
      baths TEXT,
      sqft INTEGER,
      price_per_sqft TEXT,
      sale_date TEXT NOT NULL
    );
  `);

  // Create market_metrics table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS market_metrics (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id),
      avg_days_on_market INTEGER,
      median_sale_price TEXT,
      avg_price_per_sqft TEXT,
      price_appreciation TEXT
    );
  `);

  // Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      image TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Create sessions table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS session (
      sid VARCHAR NOT NULL PRIMARY KEY,
      sess JSON NOT NULL,
      expire TIMESTAMP(6) NOT NULL
    );
    CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
  `);

  console.log('✓ Supabase tables created successfully');
}

// Run setup
setupSupabaseTables();