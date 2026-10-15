import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in admin/.env.local');
}

export const supabase = createClient(url, anonKey);

export const MEDIA_BUCKET = 'media';
