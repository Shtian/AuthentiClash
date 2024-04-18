<script lang="ts">
	import InlineMessage from '$lib/components/InlineMessage.svelte';
	import { page } from '$app/stores';
	import { generateNickName } from '$lib/utils/word-generator/generator.js';
	import { capitalize } from '$lib/utils/casing.js';
	import { fade } from 'svelte/transition';
	import { formatTimeDelta, timeUntilCooldownEnds } from '$lib/utils/dateUtils.js';
	import GameHighScore from './GameHighScore.svelte';
	import { Clock, Copy, LucideLoader2, RefreshCw, Sparkles } from 'lucide-svelte';
	import Cooldown from './Cooldown.svelte';
	import Button from '$lib/components/Button.svelte';
	import { onDestroy } from 'svelte';
	import { toast } from '$lib/stores/ToastStore';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import * as Popover from '$lib/components/ui/popover';

	export let data;
	export let newScore: number | null = null;
	export let recentRefresh = false;
	let nickname = capitalize`${generateNickName()}`;
	let isLoading = false;

	$: players = data.players;

	let cooldownRemaining = timeUntilCooldownEnds(data.currentPlayer?.updated_at, data.cooldownHours);

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

	const millisecondsToEnd = new Date(data.endsAt).getTime();
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

	onDestroy(() => {
		clearInterval(timer);
	});

	const handleNewScore: SubmitFunction = () => {
		isLoading = true;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				if (result.data?.unlockBadgeStatus > 0) {
					const msg =
						result.data?.unlockBadgeStatus === 1
							? "You've unlocked a new badge! 🏆"
							: `You've unlocked ${result.data?.unlockBadgeStatus} new badges! 🏆`;
					toast.send({
						message: msg,
						type: 'success'
					});
				}
				toast.send({
					message: result.data?.message,
					type: 'success',
					duration: 15000
				});
				if (result.data) {
					cooldownRemaining = timeUntilCooldownEnds(new Date().toISOString(), data.cooldownHours);
				}
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

{#if $page.error}
	<InlineMessage msgType="error">{$page.error.message}</InlineMessage>
{/if}

<header>
	<div class="mx-auto flex max-w-7xl flex-col gap-y-2 sm:px-6 lg:px-8">
		<div class="flex flex-row gap-2">
			<h1 class="tracking-tigh text-3xl font-bold leading-tight text-white">{data.gameName}</h1>
			<button
				type="submit"
				class="relative inline-flex items-center gap-x-2 self-center rounded-md bg-transparent px-2 py-2 text-sm font-semibold text-white transition-colors hover:text-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
				on:click={copyUrl}
			>
				<Copy />
				{#if urlIsRecentlyCopied}
					<span class="absolute -bottom-[0.875rem] text-sm text-white" in:fade out:fade
						>Copied!</span
					>
				{/if}
			</button>
		</div>
		<p class="text-pretty text-sm text-gray-300" title={data.endsAt}>
			Time remaining: {timeLeftText}
		</p>
		{#if data.aiEnabled}
			<Popover.Root>
				<Popover.Trigger class="w-max">
					<div class="rounded-md px-1.5 py-0.5 text-xs font-medium ring-1">
						<Sparkles class="inline size-4" /> AI enabled
					</div>
				</Popover.Trigger>
				<Popover.Content class="text-pretty text-sm">
					AI features have been enabled for this game:
					<ul class="ml-4 list-disc">
						<li>Click the sparkles on your row to generate an epic avatar!</li>
					</ul>
				</Popover.Content>
			</Popover.Root>
		{/if}
	</div>
</header>
<main>
	<div class="mx-auto mt-5 max-w-7xl py-5 sm:px-6 lg:px-8">
		{#if timeLeft > 0}
			<form method="POST" action="?/updateScore" use:enhance={handleNewScore}>
				<p>
					{data.currentPlayer
						? 'Register new 2FA Code'
						: 'Choose your nickname and enter your 2FA code to join the game!'}
				</p>
				<input
					type="hidden"
					name="is-participating"
					id="is-participating"
					value={!!data.currentPlayer}
				/>
				<input type="hidden" name="game-id" id="game-id" value={data.gameId} />
				<div class="mt-4 grid grid-cols-3 gap-x-6 gap-y-8">
					{#if !data.currentPlayer}
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
										class="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
									/>
									<button
										class="absolute right-2 top-1/2 -translate-y-1/2"
										type="button"
										on:click={handleNicknameRefresh}
									>
										<span class="sr-only">Generate new nickname suggestion</span>
										<RefreshCw
											class="h-6 w-6 origin-center [animation-duration:0.2s] [animation-iteration-count:1] {recentRefresh
												? 'animate-spin'
												: null}"
										/>
									</button>
								</div>
							</div>
						</div>
					{/if}
					<div class="col-span-2">
						<label for="2fa-score" class="block text-sm font-medium leading-6 text-white"
							>2FA value (1-99)</label
						>
						<div class="mt-2">
							<div
								class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-clash-500"
							>
								<input
									type="number"
									name="2fa-score"
									id="2fa-score"
									value={newScore}
									required
									min="1"
									max="99"
									class="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>
					<div class="col-span-1 self-end">
						{#if cooldownRemaining <= 0}
							<Button type="submit" disabled={isLoading}>
								{#if isLoading}
									<LucideLoader2 class="h-6 w-6 animate-spin" />
								{:else}
									{data.currentPlayer ? 'Add Score' : 'Join Game'}
								{/if}
							</Button>
						{:else}
							<Button type="submit" disabled>
								<Clock class="mr-2 h-4 w-4 flex-shrink-0" />
								<Cooldown bind:delta={cooldownRemaining}></Cooldown>
							</Button>
						{/if}
					</div>
				</div>
			</form>
		{:else}
			<p class="text-white">Final scores:</p>
		{/if}
		<GameHighScore {players} currentPlayerId={data.session?.user.id} aiEnabled={data.aiEnabled} />
	</div>
</main>
