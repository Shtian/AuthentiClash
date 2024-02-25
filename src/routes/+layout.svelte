<script lang="ts">
	import '../app.pcss';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Toast from '$lib/components/toast/Toast.svelte';
	import { page } from '$app/stores';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	$: title = $page.data.title;

	const baseUrl = 'https://www.authenticlash.app';

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
	<title>{title ? `${title} - ` : ''}AuthentiClash</title>
	<meta
		name="description"
		content={$page.data.description || 'Get Ready for the Most Average Adventure of Your Life!'}
	/>
	<link rel="canonical" href={baseUrl + $page.url.pathname} />
	<meta property="og:site_name" content="AuthentiClash" />
	<meta property="og:locale" content="en" />
	<meta property="og:url" content={baseUrl + $page.url.pathname} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{title ? `${title} - ` : ''}AuthentiClash" />
	<meta
		property="og:description"
		content={$page.data.description || 'Get Ready for the Most Average Adventure of Your Life!'}
	/>
	{#if $page.data.image}
		<meta property="og:image" content={$page.data.image} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
</svelte:head>

<Toast />
<Header {session} />
<div class="min-h-full mx-auto max-w-7xl px-4 py-8 lg:py-24 sm:px-6 sm:py-32 lg:px-8">
	<div class="mx-auto max-w-2xl">
		<slot />
	</div>
</div>
