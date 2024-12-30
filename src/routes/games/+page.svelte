<script lang="ts">
	import GameList from './GameList.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	$: games = data.participatingGames || [];

	function tabSelected(e: Event) {
		const eventTarget: HTMLSelectElement = e.target as HTMLSelectElement;
		const tabname = eventTarget.value;
		let url = new URL($page.url);
		const currentFilter = url.searchParams.get('filter');
		if (currentFilter === null && tabname === '') return;
		if (currentFilter !== null && tabname === '') goto(`/games`);
		if (currentFilter !== tabname) {
			url.searchParams.set('filter', tabname);
			goto(url);
		}
	}
</script>

<main>
	<div class="mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-10">
		<div class="heading mx-auto mb-6 max-w-2xl lg:mx-0">
			<div class="mb-6 flex place-content-between items-center">
				<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Games</h2>
				<a
					href="/games/create"
					class="block rounded-md bg-clash-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
					>New game</a
				>
			</div>
			<div class="sm:hidden">
				<label for="tabs" class="sr-only">Select a tab</label>
				<select
					id="tabs"
					name="tabs"
					class="block w-full rounded-md border-none bg-white/5 py-2 pl-3 pr-10 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
					on:change={tabSelected}
				>
					<option selected={$page.url.searchParams.get('filter') === null} value="">Active</option>
					<option selected={$page.url.searchParams.get('filter') === 'ended'} value="ended"
						>Ended</option
					>
					<option selected={$page.url.searchParams.get('filter') === 'created'} value="created"
						>Created</option
					>
				</select>
			</div>
			<div class="hidden sm:block">
				<nav class="flex border-b border-white/10 py-4">
					<ul
						role="list"
						class="flex min-w-full flex-none gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-400"
					>
						<a
							href="/games"
							class={`transition-colors ${$page.url.searchParams.get('filter') === null ? 'text-clash-200' : 'hover:text-white'}`}
							>Active</a
						>
						<a
							href="/games?filter=ended"
							class={`transition-colors ${$page.url.searchParams.get('filter') === 'ended' ? 'text-clash-200' : 'hover:text-white'}`}
							>Ended</a
						>
						<a
							href="/games?filter=created"
							class={`transition-colors ${$page.url.searchParams.get('filter') === 'created' ? 'text-clash-200' : 'hover:text-white'}`}
							>Created</a
						>
					</ul>
				</nav>
			</div>
		</div>
		{#if games.length}
			<GameList gamesWithParticipation={games} />
		{:else}
			<p class="mt-6 text-white">
				{#if $page.url.searchParams.get('filter') === null}
					No active games
				{:else if $page.url.searchParams.get('filter') === 'ended'}
					No ended games
				{:else if $page.url.searchParams.get('filter') === 'created'}
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
