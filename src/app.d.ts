import { SupabaseClient, Session } from '@supabase/supabase-js';
// https://kit.svelte.dev/docs/types#
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
			title: string;
			image?: string;
			description?: string;
		}
	}
}

export {};
