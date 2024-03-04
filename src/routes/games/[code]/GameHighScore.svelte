<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/ToastStore';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Image, Loader2 } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	export let players: {
		id: any;
		score: any;
		total_score: any;
		profile_id: any;
		updated_at: any;
		nickname: any;
		nickname_image_url: any;
	}[] = [];
	console.log(players);
	export let currentPlayerId = '';

	let isLoading = false;

	const handleGenerateImage: SubmitFunction = () => {
		isLoading = true;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.send({
					message: result.data?.message,
					type: 'success'
				});
			}
			if (result.type === 'failure') {
				toast.send({
					message: result.data?.message,
					type: 'error'
				});
			}
			isLoading = false;
			await update();
		};
	};
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
						<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white"> </th>
						<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">
							Name
						</th>
						<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">
							Score
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each players.sort((a, b) => b.total_score - a.total_score) as player, i (player.profile_id)}
						<tr
							class:bg-clash-800={player.profile_id === currentPlayerId}
							animate:flip={{ duration: 300 }}
						>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-2">
								#{i + 1}
							</td>
							<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-2">
								{#if player.nickname_image_url}
									<img
										src={player.nickname_image_url}
										alt={player.nickname}
										class="size-6 rounded-full"
									/>
								{:else if isLoading}
									<Loader2 class="size-6 text-gray-300 animate-spin"></Loader2>
								{:else}
									<form
										method="post"
										action="?/generateParticipantImage"
										use:enhance={handleGenerateImage}
										class="flex items-center"
									>
										<input type="hidden" name="participation-id" value={player.id} />
										<input type="hidden" name="nickname" value={player.nickname} />
										<button
											type="submit"
											title="Generate participant image "
											class="text-gray-300 hover:text-white transition-colors"
										>
											<span class="sr-only">Generate participant image</span>
											<Image class="size-6" />
										</button>
									</form>
								{/if}
							</td>
							<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{player.nickname}</td>
							<td
								class="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
								title={player.score.join(' → ')}>{player.total_score}</td
							>
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
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
