import tailwindcss from '@tailwindcss/vite';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sentrySvelteKit({
			sourceMapsUploadOptions: { org: 'stian-haga', project: 'authenticlash' }
		}),
		sveltekit()
	],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
