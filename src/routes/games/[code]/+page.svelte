<script lang="ts">
	import InlineMessage from '$lib/components/InlineMessage.svelte';
	import { page } from '$app/stores';
	import { generateNickName } from '$lib/utils/word-generator/generator.js';

	export let data;

	export let nickname = generateNickName();
	export let newScore: number | null = null;
	export let recentRefresh = false;

	const players = data.game.participation.map((player) => {
		return {
			uuid: player.profile_id,
			nickname: player.nickname,
			score: player.score,
			maxScore: Math.max(player.score)
		};
	});

	const isParticipating =
		players.findIndex((player) => player.uuid === data.session?.user.id) !== -1;

	const handleNicknameRefresh = () => {
		recentRefresh = true;
		setTimeout(() => {
			recentRefresh = false;
			nickname = generateNickName();
		}, 200);
	};
</script>

{#if $page.error}
	<InlineMessage msgType="error">{$page.error.message}</InlineMessage>
{/if}

{#if data.game}
	<h1 class="text-base font-semibold leading-7 text-white">{data.game.name}</h1>

	<p class="mt-10">
		{isParticipating ? 'Register new 2FA Code' : 'Register new 2FA Code and join this game'}
	</p>
	<form>
		<div class="mt-4 grid gap-x-6 gap-y-8 grid-cols-3">
			{#if !isParticipating}
				<div class="col-span-3">
					<label for="nickname" class="block text-sm font-medium leading-6 text-white"
						>Nickname</label
					>
					<div class="mt-2">
						<div
							class="relative flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
						>
							<input
								type="text"
								name="nickname"
								id="nickname"
								autocomplete="name"
								value={nickname}
								required
								minlength="3"
								class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6 transition-all duration-200"
								class:[transform:rotateX(2turn)]={recentRefresh}
							/>
							<button
								class="absolute right-2 top-1/2 transform -translate-y-1/2"
								type="button"
								on:click={handleNicknameRefresh}
							>
								<span class="sr-only">Generate new nickname suggestion</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			{/if}
			<div class="col-span-2">
				<label for="2fa-score" class="block text-sm font-medium leading-6 text-white"
					>New 2FA value</label
				>
				<div class="mt-2">
					<div
						class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
					>
						<input
							type="number"
							name="2fa-score"
							id="2fa-score"
							autocomplete="name"
							value={newScore}
							required
							min="1"
							max="99"
							class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>
			</div>
			<div class="col-span-1 self-end">
				<button
					type="submit"
					class="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
				>
					Add Score
				</button>
			</div>
		</div>
	</form>

	<ol class="mt-10">
		{#each players as player (player.uuid)}
			<li>{player.nickname} - {player.maxScore}</li>
		{:else}
			<li>No participants yet!</li>
		{/each}
	</ol>
{/if}
