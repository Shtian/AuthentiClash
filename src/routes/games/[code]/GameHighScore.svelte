<script lang="ts">
	export let players: { nickname: string; maxScore: number; uuid: string }[] = [];
	export let currentPlayerId = '';
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
							Rank
						</th>
						<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">
							Name
						</th>
						<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">
							Score
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each players as player, i (player.uuid)}
						<tr class:bg-clash-800={player.uuid === currentPlayerId}>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-2">
								#{i + 1}
							</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{player.nickname}</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{player.maxScore}</td>
						</tr>
					{:else}
						<tr>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-2">
								-
							</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">-</td>
							<td class="whitespace">
								<span class="text-sm text-gray-300">No scores yet</span>
							</td>
						</tr>{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>