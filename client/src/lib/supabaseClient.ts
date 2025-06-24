import { createClient } from '@supabase/supabase-js'

// For Vite projects, environment variables exposed to the client must start with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Missing environment variable: VITE_SUPABASE_URL. Please ensure it's set in your .env file in the 'client' directory.");
  throw new Error("Supabase URL is required. Make sure VITE_SUPABASE_URL is set in client/.env");
}

if (!supabaseAnonKey) {
  console.error("Missing environment variable: VITE_SUPABASE_ANON_KEY. Please ensure it's set in your .env file in the 'client' directory.");
  throw new Error("Supabase anon key is required. Make sure VITE_SUPABASE_ANON_KEY is set in client/.env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
