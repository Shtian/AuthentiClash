<script lang="ts">
	import { toast } from '$lib/stores/ToastStore.js';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import discordLogo from '$lib/assets/discord_logo_white.svg';
	import googleLogo from '$lib/assets/google_logo.svg';
	import githubLogo from '$lib/assets/github_logo.svg';

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	export let supabase: SupabaseClient<any, 'public', any>;

	type OAuthProvider = 'github' | 'discord' | 'google';

	const oAuthLogin = async (provider: OAuthProvider) => {
		const options =
			provider === 'google'
				? {
						queryParams: {
							access_type: 'offline',
							prompt: 'consent'
						}
					}
				: {};

		const { error } = await supabase.auth.signInWithOAuth({ provider, options });
		if (error) {
			toast.send({ message: `Error logging in with ${provider}: ${error.message}`, type: 'error' });
		}
	};
</script>

<button
	class="flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500 mt-1"
	on:click={() => oAuthLogin('google')}
	><img
		class="size-6 mr-3"
		width="24"
		height="24"
		src={googleLogo}
		alt="Google logo"
	/>Google</button
>
<button
	class="flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500 mt-2"
	on:click={() => oAuthLogin('github')}
	><img
		class="size-6 mr-3"
		width="24"
		height="24"
		src={githubLogo}
		alt="Github logo"
	/>GitHub</button
>
<button
	class="flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500 mt-2"
	on:click={() => oAuthLogin('discord')}
	><img
		class="size-6 mr-3"
		width="24"
		height="24"
		src={discordLogo}
		alt="Discord logo"
	/>Discord</button
>
