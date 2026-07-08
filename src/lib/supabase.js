import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check that .env has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set, and restart the dev server after editing .env."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);