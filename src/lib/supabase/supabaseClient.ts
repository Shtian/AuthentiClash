import { createClient, type PostgrestError } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export type SupabaseResponse<T> =
	| { type: 'sucess'; data: T; error: null }
	| { type: 'error'; data: null; error: PostgrestError };
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
