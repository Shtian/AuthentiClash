<script lang="ts">
	import { DateFormatter } from '@internationalized/date';
	export let data;
	const games = data.participatingGames || [];
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
</script>

<header>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold leading-tight tracking-tigh text-white">Games</h1>
	</div>
</header>
<main>
	<div class="mx-auto max-w-7xl sm:px-6 lg:px-8 py-10">
		{#if games.length > 0}
			<ul class="flex flex-col gap-y-4">
				{#each games as game}
					<li class="flex justify-between">
						{game.name}
						<a
							href={`/games/${game.code}`}
							class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>View</a
						>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mx-auto h-12 w-12 text-gray-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-semibold text-white">No active games</h3>
				<p class="mt-1 text-sm text-white">Get started by creating a new AuthentiClash session.</p>
				<div class="mt-6">
					<a
						href="/games/create"
						type="button"
						class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						<svg
							class="-ml-0.5 mr-1.5 h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
							/>
						</svg>
						New AuthentiClash
					</a>
				</div>
			</div>
		{/if}
	</div>
</main>
