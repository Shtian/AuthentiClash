<script lang="ts">
	import { RocketIcon } from 'lucide-svelte';
	import StatsCard from './StatsCard.svelte';
	import StatsNumber from './StatsNumber.svelte';
	import ScoreGraph from '$lib/components/ScoreGraph.svelte';

	export let data;
	const {
		numberOfGames,
		allScores,
		totalScoreAcrossGames,
		average2FAScore,
		averageTotalScore,
		median2FAscore,
		wins
	} = data.stats;
</script>

<div class="mx-auto max-w-[1200px] px-6 lg:px-8 lg:py-10">
	{#if numberOfGames}
		<div class="grid grid-cols-12 gap-4">
			<StatsCard title="Number of Games">
				<p class="text-center text-4xl font-bold">
					<StatsNumber value={numberOfGames} />
				</p>
			</StatsCard>
			<StatsCard title="Number of Wins">
				<p class="text-center text-4xl font-bold">
					<StatsNumber value={wins} />
				</p>
			</StatsCard>
			<StatsCard title="Average Total Score">
				<p class="text-center text-4xl font-bold">
					<StatsNumber value={averageTotalScore} decimals={2} />
				</p>
			</StatsCard>
			<StatsCard title="Total accumulated score">
				<p class="text-center text-4xl font-bold">
					<StatsNumber value={totalScoreAcrossGames} />
				</p>
			</StatsCard>
			<StatsCard title="2FA value history" cols="full">
				<ScoreGraph scores={allScores} height={300} />
			</StatsCard>
			<StatsCard title="Median 2FA Value">
				<p class="text-center text-4xl font-bold">
					<StatsNumber value={median2FAscore} />
				</p>
			</StatsCard>
			<StatsCard title="Average 2FA Value">
				<p class="text-center text-4xl font-bold">
					<StatsNumber value={average2FAScore} decimals={2} />
				</p>
			</StatsCard>
		</div>
	{:else}
		<div class="mx-auto max-w-7xl py-6 text-center sm:px-6 lg:px-8 lg:py-10">
			<RocketIcon class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-2 text-sm font-semibold text-white">No past games found</h3>
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
