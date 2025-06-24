import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ctbyylprhvjcmhkgmptm.supabase.co'
// The user provided this, it is the anon key.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0Ynl5bHByaHZqY21oa2dtcHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDIxNzMsImV4cCI6MjA2NjMxODE3M30.kkX169CAUl_bDkzuc5TCkWmTlNpWS4St5A3VhFBlXFs'

if (!supabaseUrl) {
  throw new Error("Supabase URL is required.");
}

if (!supabaseAnonKey) {
  throw new Error("Supabase anon key is required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
