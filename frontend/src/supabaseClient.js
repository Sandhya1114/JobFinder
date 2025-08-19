// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Access the environment variables correctly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Use import.meta.env
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Use import.meta.env

export const supabase = createClient(supabaseUrl, supabaseAnonKey);