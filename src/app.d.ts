import { SupabaseClient, Session, type UserResponse } from '@supabase/supabase-js';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
			user: UserResponse;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
