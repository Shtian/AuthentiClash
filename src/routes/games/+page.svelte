<script lang="ts">
	import GameList from './GameList.svelte';
	import { page } from '$app/state';
	import Tabs from '$lib/components/Tabs.svelte';

	const { data } = $props();

	const games = $derived(data.participatingGames || []);

	const tabs = $derived([
		{
			name: 'Active',
			url: '/games',
			isActive: page.url.searchParams.get('filter') === null
		},
		{
			name: 'Ended',
			url: '/games?filter=ended',
			isActive: page.url.searchParams.get('filter') === 'ended'
		},
		{
			name: 'Created',
			url: '/games?filter=created',
			isActive: page.url.searchParams.get('filter') === 'created'
		}
	]);
</script>

<main>
	<div class="mx-auto max-w-2xl sm:px-6 lg:px-8 lg:py-10">
		<div class="heading mx-auto mb-6 max-w-2xl lg:mx-0">
			<div class="mb-6 flex place-content-between items-center">
				<h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Games</h2>
				<a
					href="/games/create"
					class="bg-clash-500 hover:bg-clash-400 focus-visible:outline-clash-500 text-background dark:text-foreground rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
					>New game</a
				>
			</div>
			<Tabs {tabs} />
		</div>
		{#if games.length}
			<GameList gamesWithParticipation={games} />
		{:else}
			<p class="text-foreground mt-6">
				{#if page.url.searchParams.get('filter') === null}
					No active games
				{:else if page.url.searchParams.get('filter') === 'ended'}
					No ended games
				{:else if page.url.searchParams.get('filter') === 'created'}
					You have not created any games
				{/if}
			</p>
		{/if}
	</div>
</main>

<style>
	.heading {
		view-transition-name: game-heading;
	}
</style>
