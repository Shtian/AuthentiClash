<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import { DateFormatter } from '@internationalized/date';
	import { RocketIcon } from 'lucide-svelte';
	import GameList from './GameList.svelte';
	export let data;
	const df = new DateFormatter('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short',
		hour12: false
	});
	const games = data.participatingGames || [];
	const gamesWithParticipation = games
		.map((game) => {
			const sortedParticipations = game.participation?.toSorted((a, b) => {
				const aScore = a.score || [0];
				const bScore = b.score || [0];
				const aMaxScore = Math.max(...aScore);
				const bMaxScore = Math.max(...bScore);
				return bMaxScore - aMaxScore;
			});
			const userRankIndex = sortedParticipations.findIndex((p) => p.profile_id === data.profileId);
			const userRank = userRankIndex === -1 ? 0 : userRankIndex + 1;
			const participation = game.participation.find((p) => p.profile_id === data.profileId);
			const userScore = participation?.score || [0];
			const userMaxScore = Math.max(...userScore);
			return {
				id: game.id,
				name: game.name,
				code: game.code,
				userMaxScore,
				userRank,
				endAtString: df.format(new Date(game.end_at)),
				endAtDate: new Date(game.end_at),
				timeToEnd: new Date(game.end_at).getTime() - Date.now()
			};
		})
		.sort((a, b) => b.timeToEnd - a.timeToEnd);
</script>

<main>
	<div class="mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-10">
		{#if games.length > 0}
			<header>
				<div class="sm:flex sm:items-center">
					<div class="sm:flex-auto">
						<h1 class="text-base font-semibold leading-6 text-white">Games</h1>
						<p class="mt-2 text-sm text-gray-300">
							All games you are or have been participating in
						</p>
					</div>
					<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<a
							href="/games/create"
							class="block rounded-md bg-clash-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
							>New game</a
						>
					</div>
				</div>
			</header>
			<GameList {gamesWithParticipation} />
		{:else}
			<div class="text-center">
				<RocketIcon class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-semibold text-white">No active games</h3>
				<p class="mt-1 text-sm text-white">Get started by creating a new AuthentiClash session.</p>
				<div class="mt-6">
					<a
						href="/games/create"
						type="button"
						class="inline-flex items-center rounded-md bg-clash-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clash-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-600"
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
