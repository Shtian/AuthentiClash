<script lang="ts">
	import { toast } from '$lib/stores/ToastStore.js';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import discordLogo from '$lib/assets/discord_logo_white.svg';
	import googleLogo from '$lib/assets/google_logo.svg';
	import githubLogo from '$lib/assets/github_logo.svg';

	interface Props {
		supabase: SupabaseClient<any, 'public', any>;
	}

	const { supabase }: Props = $props();

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
	class="mt-1 flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
	onclick={() => oAuthLogin('google')}
	><img
		class="mr-3 size-6"
		width="24"
		height="24"
		src={googleLogo}
		alt="Google logo"
	/>Google</button
>
<button
	class="mt-2 flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
	onclick={() => oAuthLogin('github')}
	><img
		class="mr-3 size-6"
		width="24"
		height="24"
		src={githubLogo}
		alt="Github logo"
	/>GitHub</button
>
<button
	class="mt-2 flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
	onclick={() => oAuthLogin('discord')}
	><img
		class="mr-3 size-6"
		width="24"
		height="24"
		src={discordLogo}
		alt="Discord logo"
	/>Discord</button
>
