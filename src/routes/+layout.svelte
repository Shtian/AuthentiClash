<script lang="ts">
	import '../app.pcss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Toast from '$lib/components/toast/Toast.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>AuthentiClash</title>
</svelte:head>

<Toast />
<Header {session} />
<div class="min-h-full mx-auto max-w-7xl px-4 py-8 lg:py-24 sm:px-6 sm:py-32 lg:px-8">
	<div class="mx-auto max-w-2xl">
		<slot />
	</div>
</div>
