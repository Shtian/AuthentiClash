<script lang="ts">
	import { goto } from '$app/navigation';
	import Badge from '$lib/components/Badge.svelte';

	interface Props {
		gamesWithParticipation?: Array<{
			id: string;
			name: string;
			userRank: number;
			endAtString: string;
			endAtDate: Date;
			code: string;
			totalScore: number;
		}>;
	}

	const { gamesWithParticipation = [] }: Props = $props();
</script>

<div class="mt-6 flow-root">
	<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
			<table class="min-w-full divide-y divide-gray-700">
				<thead>
					<tr>
						<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">
							Game
						</th>
						<th scope="col" class="py-3.5 pr-3 text-left text-sm font-semibold text-white">
							Your Rank
						</th>
						<th scope="col" class="py-3.5 pr-3 text-left text-sm font-semibold text-white">
							Status
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each gamesWithParticipation as game (game.id)}
						<tr
							onclick={() => {
								goto(`/games/${game.code}`);
							}}
							class="group cursor-pointer transition-colors hover:bg-gray-800"
						>
							<td
								class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white group-hover:underline"
							>
								{game.name}
							</td>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0"
								>{game.userRank === 0 ? 'No entries' : `#${game.userRank} (${game.totalScore})`}</td
							>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
								<Badge
									title={game.endAtString}
									color={game.endAtDate < new Date() ? 'red' : 'green'}
									>{game.endAtDate < new Date() ? 'Ended' : 'In Progress'}</Badge
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
