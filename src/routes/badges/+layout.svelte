<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	import Tabs from '$lib/components/Tabs.svelte';

	interface Props {
		children?: Snippet;
	}

	const { children }: Props = $props();

	const tabs = $derived([
		{
			name: 'Overview',
			url: '/badges',
			isActive: $page.url.pathname === '/badges'
		},
		{
			name: 'Activity',
			url: '/badges/activity',
			isActive: $page.url.pathname === '/badges/activity'
		}
	]);
</script>

<div class="tabs px-4 py-6 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<Tabs {tabs} />
	</div>
</div>

{@render children?.()}

<style>
	.tabs {
		view-transition-name: tabs;
	}
</style>
