import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

Sentry.init({
    dsn: "https://e3619164ee187231b7ee10d1eabfed75@o4506763794972672.ingest.sentry.io/4506763796938752",
    tracesSampleRate: 1
})

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	const supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.supabase = supabase;

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
});
export const handleError = Sentry.handleErrorWithSentry();