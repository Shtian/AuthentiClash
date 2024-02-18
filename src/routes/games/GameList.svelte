<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';

	export let gamesWithParticipation: {
		id: string;
		name: string;
		userRank: number;
		userMaxScore: number;
		endAtString: string;
		endAtDate: Date;
		code: string;
	}[] = [];
</script>

<div class="mt-8 flow-root">
	<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
		<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
			<table class="min-w-full divide-y divide-gray-700">
				<thead>
					<tr>
						<th
							scope="col"
							class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
						>
							Game
						</th>
						<th scope="col" class="pr-3 py-3.5 text-left text-sm font-semibold text-white">
							Your Rank
						</th>
						<th scope="col" class="pr-3 py-3.5 text-left text-sm font-semibold text-white">
							Status
						</th>
						<th scope="col" class="pr-3 py-3.5 text-left text-sm font-semibold text-white"> </th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each gamesWithParticipation as game (game.id)}
						<tr>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
								{game.name}
							</td>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0"
								>{game.userRank === 0
									? 'No entries'
									: `#${game.userRank} (${game.userMaxScore})`}</td
							>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
								<Badge
									title={game.endAtString}
									text={game.endAtDate < new Date() ? 'Ended' : 'In Progress'}
									color={game.endAtDate < new Date() ? 'red' : 'green'}
								/>
							</td>
							<td class="whitespace-nowrap text-end px-3 py-4 text-sm text-gray-300"
								><a
									href={`/games/${game.code}`}
									class="inline-flex items-center rounded-md bg-clash-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clash-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-600"
									>View</a
								></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
