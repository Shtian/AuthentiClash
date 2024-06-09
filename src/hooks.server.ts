import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SENTRY_DNS,
	PUBLIC_ENV
} from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';
// import { consoleIntegration } from '@sentry/sveltekit';

Sentry.init({
	dsn: PUBLIC_SENTRY_DNS,
	tracesSampleRate: 1,
	environment: PUBLIC_ENV
	// integrations: [consoleIntegration()]
});

export const handle: Handle = sequence(async ({ event, resolve }) => {
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
// export const handleError = Sentry.handleErrorWithSentry();
