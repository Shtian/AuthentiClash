<script lang="ts">
	import InlineMessage from '$lib/components/InlineMessage.svelte';
	import { page } from '$app/stores';
	import { generateNickName } from '$lib/utils/word-generator/generator.js';
	import { capitalize } from '$lib/utils/casing.js';
	import { fade } from 'svelte/transition';
	import { formatTimeDelta } from '$lib/utils/dateUtils.js';
	import GameHighScore from './GameHighScore.svelte';

	export let data;

	export let nickname = capitalize`${generateNickName()}`;
	export let newScore: number | null = null;
	export let recentRefresh = false;

	const players = data.game.participation
		.map((participation) => {
			return {
				id: participation.id,
				uuid: participation.profile_id,
				nickname: participation.nickname,
				score: participation.score,
				maxScore: Math.max(...participation.score)
			};
		})
		.sort((a, b) => b.maxScore - a.maxScore);

	const isParticipating =
		players.findIndex((player) => player.uuid === data.session?.user.id) !== -1;

	const handleNicknameRefresh = () => {
		recentRefresh = true;
		setTimeout(() => {
			recentRefresh = false;
		}, 1000);
		const newNickname = capitalize`${generateNickName()}`;
		newNickname.split('').forEach((_, i) => {
			setTimeout(() => {
				nickname = newNickname.slice(0, i + 1);
			}, i * 25);
		});
	};

	let urlIsRecentlyCopied = false;
	const copyUrl = () => {
		navigator.clipboard.writeText(window.location.href);
		urlIsRecentlyCopied = true;
		window.setTimeout(() => {
			urlIsRecentlyCopied = false;
		}, 3000);
	};

	const millisecondsToEnd = new Date(data.game.end_at).getTime();
	let millisecondsNow = new Date().getTime();
	let timeLeft = millisecondsToEnd - millisecondsNow;
	let timeLeftText = timeLeft > 0 ? formatTimeDelta(timeLeft) : 'Game has ended';

	const timer = setInterval(() => {
		millisecondsNow = new Date().getTime();
		timeLeft = millisecondsToEnd - millisecondsNow;
		if (timeLeft <= 0) {
			clearInterval(timer);
			timeLeftText = 'Game has ended';
		} else {
			timeLeftText = formatTimeDelta(timeLeft);
		}
	}, 1000);
</script>

{#if $page.error}
	<InlineMessage msgType="error">{$page.error.message}</InlineMessage>
{/if}

{#if data.game}
	<header>
		<div class="flex flex-col gap-y-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div class="flex flex-row gap-2">
				<h1 class="text-3xl font-bold leading-tight tracking-tigh text-white">{data.game.name}</h1>
				<button
					type="submit"
					class="relative inline-flex gap-x-2 items-center self-center rounded-md bg-transparent px-2 py-2 text-sm font-semibold text-white hover:text-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500 transition-colors"
					on:click={copyUrl}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-copy"
						><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
							d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
						/></svg
					>
					{#if urlIsRecentlyCopied}
						<span class="absolute -bottom-[0.875rem] text-sm text-white" in:fade out:fade
							>Copied!</span
						>
					{/if}
				</button>
			</div>
			<p class="text-sm text-gray-300 text-pretty" title={data.game.end_at}>
				Time remaining: {timeLeftText}
			</p>
		</div>
	</header>
	<main>
		<div class="mx-auto max-w-7xl sm:px-6 lg:px-8 py-5 mt-5">
			{#if timeLeft > 0}
				<form method="post" action="?/updateScore">
					<p>
						{isParticipating
							? 'Register new 2FA Code'
							: 'Choose your nickname and enter your 2FA code to join the game!'}
					</p>
					<input
						type="hidden"
						name="is-participating"
						id="is-participating"
						value={isParticipating}
					/>
					<input type="hidden" name="game-id" id="game-id" value={data.game.id} />
					<div class="mt-4 grid gap-x-6 gap-y-8 grid-cols-3">
						{#if !isParticipating}
							<div class="col-span-3">
								<label for="nickname" class="block text-sm font-medium leading-6 text-white"
									>Nickname</label
								>
								<div class="mt-2">
									<div
										class="relative flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-clash-500"
									>
										<input
											type="text"
											name="nickname"
											id="nickname"
											autocomplete="name"
											value={nickname}
											required
											minlength="3"
											class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
										/>
										<button
											class="absolute right-2 top-1/2 -translate-y-1/2"
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
												class="w-6 h-6 origin-center [animation-duration:0.2s] [animation-iteration-count:1]"
												class:animate-spin={recentRefresh}
												aria-hidden="true"
												focusable="false"
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
								>2FA value</label
							>
							<div class="mt-2">
								<div
									class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-clash-500"
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
								class="w-full rounded-md bg-clash-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
							>
								{isParticipating ? 'Add Score' : 'Join Game'}
							</button>
						</div>
					</div>
				</form>
			{:else}
				<p class="text-white">Final scores:</p>
			{/if}
			<GameHighScore {players} currentPlayerId={data.session?.user.id} />
		</div>
	</main>
{/if}
