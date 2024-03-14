<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/ToastStore';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LineChart, Loader2, Sparkles } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import * as Popover from '$lib/components/ui/popover';
	import ScoreGraph from '$lib/components/ScoreGraph.svelte';

	export let players: {
		id: any;
		score: any;
		total_score: any;
		profile_id: any;
		updated_at: any;
		nickname: any;
		nickname_image_url: any;
	}[] = [];
	export let aiEnabled = false;
	export let currentPlayerId = '';

	let isLoading = false;

	const handleGenerateImage: SubmitFunction = () => {
		isLoading = true;
		toast.send({
			message: 'Generating your avatar, this may take a while ⏳',
			type: 'info'
		});
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
	<div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
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
						<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white"> </th>
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
							<td
								class="flex items-center gap-x-2 whitespace-nowrap px-3 py-4 text-sm text-gray-300"
								>{#if player.nickname_image_url}
									<Popover.Root>
										<Popover.Trigger
											><img
												src={`${player.nickname_image_url.replace('.webp', '-128.webp')}`}
												alt={player.nickname}
												class="size-6 rounded-full"
											/></Popover.Trigger
										>
										<Popover.Content
											><a href={player.nickname_image_url} class="underline hover:no-underline mt-6"
												><img
													src={`${player.nickname_image_url.replace('.webp', '-512.webp')}`}
													width={256}
													height={256}
													alt={player.nickname}
													class="size-64"
												/></a
											></Popover.Content
										>
									</Popover.Root>
								{:else if isLoading && player.profile_id === currentPlayerId}
									<Loader2 class="size-6 text-gray-300 animate-spin"></Loader2>
								{:else if aiEnabled && player.profile_id === currentPlayerId}
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
											<Sparkles class="size-6" />
										</button>
									</form>
								{/if}{player.nickname}</td
							>
							<td
								class="whitespace-nowrap px-3 py-4 text-sm text-gray-300"
								title={player.score.join(' → ')}
								>{player.total_score}
							</td>
							<td class="whitespace-nowrap text-sm text-gray-300">
								<Popover.Root>
									<Popover.Trigger
										><span class="sr-only">Show scores</span><LineChart class="size-6 text-gray-300"
										></LineChart></Popover.Trigger
									>
									<Popover.Content
										><ScoreGraph scores={player.score} width={250} height={130} /></Popover.Content
									>
								</Popover.Root>
							</td>
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
