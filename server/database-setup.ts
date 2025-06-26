import { pool } from "./db";

// Database setup script to create all necessary tables
export async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    // Test basic connection with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    await Promise.race([
      pool.query('SELECT 1'),
      timeoutPromise
    ]);
    console.log('✓ Database connection successful');

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

    // Create users table for authentication
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

    // Create sessions table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL PRIMARY KEY,
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
    `);

    // Create index for session cleanup
    await pool.query(`
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);
    `);

    console.log('✓ Database tables created successfully');
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    return false;
  }
}

// Call setup on module import
setupDatabase();