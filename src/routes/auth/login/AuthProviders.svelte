<script lang="ts">
	import { toast } from '$lib/stores/ToastStore.js';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Github } from 'lucide-svelte';
	export let supabase: SupabaseClient<any, 'public', any>;

	const githubLogin = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
		if (error) {
			toast.send({ message: `Error logging in with GitHub: ${error.message}`, type: 'error' });
		}
	};
</script>

<button
	class="flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
	on:click={() => githubLogin()}><Github class="size-6 mr-1" /> GitHub</button
>
