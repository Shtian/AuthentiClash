import { PUBLIC_ENV, PUBLIC_SENTRY_DNS } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: PUBLIC_SENTRY_DNS,
	tracesSampleRate: 1.0,
	replaysSessionSampleRate: PUBLIC_ENV === 'production' ? 0.1 : 1.0,
	replaysOnErrorSampleRate: 1.0,
	integrations: [Sentry.replayIntegration()],
	environment: PUBLIC_ENV
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = Sentry.handleErrorWithSentry();
