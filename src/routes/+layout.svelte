<script lang="ts">
	import '../app.css';
	import { invalidate, onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Toast from '$lib/components/toast/Toast.svelte';
	import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
	import { type AuthChangeEvent, type Session } from '@supabase/supabase-js';
	import { ModeWatcher } from 'mode-watcher';

	const { data, children } = $props();
	const { session, supabase } = $derived(data);
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(
			(_: AuthChangeEvent, newSession: Session | null) => {
				if (newSession?.expires_at !== session?.expires_at) {
					invalidate('supabase:auth');
				}
			}
		);
		return () => data.subscription.unsubscribe();
	});
	const title = $derived($page.data.title);
	const baseUrl = 'https://www.authenticlash.app';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
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

<ModeWatcher />
<Toast />
<Header {session} />
<div class="mx-auto min-h-full max-w-6xl px-4 pt-8 sm:px-6 lg:pt-16">
	<div class="mx-auto max-w-6xl">
		{@render children?.()}
	</div>
</div>
<Footer />

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation:
			210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
