<script lang="ts">
	import InlineMessage from '$lib/components/InlineMessage.svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { formatTimeDelta, timeUntilCooldownEnds } from '$lib/utils/dateUtils.js';
	import GameHighScore from './GameHighScore.svelte';
	import {
		Clock,
		Copy,
		Flame,
		HandCoins,
		HandHeart,
		LucideLoader2,
		Shield,
		Skull,
		Sparkles
	} from 'lucide-svelte';
	import Cooldown from './Cooldown.svelte';
	import Button from '$lib/components/Button.svelte';
	import { onDestroy } from 'svelte';
	import { toast } from '$lib/stores/ToastStore';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import * as Popover from '$lib/components/ui/popover';
	import { ABILITIES } from '$lib/classes/abilities';
	import GameLogs from './GameLogs.svelte';
	import type { Participation } from '$lib/supabase/participation';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	let isLoading = $state(false);
	let abilityIdUsed: number | null = $state(null);
	const hasUsedAbility = $derived(
		data.players?.find((x: Participation) => x.profileId === data.session?.user.id)?.abilityUsed !==
			null
	);
	const players = $derived(data.players);

	let cooldownRemaining = $state(
		timeUntilCooldownEnds(data.currentPlayer?.updatedAt, data.cooldownHours)
	);

	let urlIsRecentlyCopied = $state(false);
	const copyUrl = () => {
		navigator.clipboard.writeText(`https://www.authenticlash.app${window.location.pathname}/join`);
		urlIsRecentlyCopied = true;
		window.setTimeout(() => {
			urlIsRecentlyCopied = false;
		}, 3000);
	};

	const millisecondsToEnd = new Date(data.endsAt).getTime();
	let millisecondsNow = new Date().getTime();
	let timeLeft = $state(millisecondsToEnd - millisecondsNow);
	let timeLeftText = $state(
		millisecondsToEnd - millisecondsNow > 0
			? formatTimeDelta(millisecondsToEnd - millisecondsNow)
			: 'Game has ended'
	);

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
				onclick={copyUrl}
			>
				<Copy />
				{#if urlIsRecentlyCopied}
					<span class="absolute -bottom-[0.875rem] text-sm text-white" in:fade out:fade
						>Copied!</span
					>
				{/if}
			</button>
		</div>
		<p class="text-pretty text-sm tabular-nums text-gray-300" title={data.endsAt}>
			Ends in: {timeLeftText}
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
				<input type="hidden" name="game-id" id="game-id" value={data.gameId} />
				<input type="hidden" name="ability-id" id="ability-id" value={abilityIdUsed} />

				<div class="mt-4 grid grid-cols-12 gap-x-6 gap-y-8">
					<div class="col-span-12 sm:col-span-4">
						<label for="2fa-score" class="block font-medium leading-6 text-white">2FA value</label>
						<p class="text-sm text-gray-400">Between 1 and 99</p>
						<div class="mt-4">
							<input
								type="number"
								name="2fa-score"
								id="2fa-score"
								required
								min="1"
								max="99"
								class="size-16 flex-1 rounded-t-md border-b-2 bg-foreground/5 p-2.5 text-4xl tabular-nums text-white transition-colors focus:border-b-clash-500 focus:outline-none"
							/>
						</div>
					</div>
					{#if data.class}
						<div class="col-span-12 sm:col-span-8">
							<p class="leading-6 text-white">Use class ability</p>
							<p class="text-sm text-gray-400">
								Active abilities can only be used <strong>once</strong> per game
							</p>
							{#each data.class.abilities as ability (ability.id)}
								<div class="mt-4 flex gap-4">
									{#if ability.description.startsWith('(Passive)')}
										<Shield class="size-12" />
									{:else}
										<button
											type="button"
											class="ability-button relative flex size-16 shrink-0 items-center border transition-colors"
											class:active={!hasUsedAbility && abilityIdUsed === ability.id}
											class:grayscale={hasUsedAbility}
											class:text-gray={hasUsedAbility}
											class:cursor-not-allowed={hasUsedAbility}
											disabled={hasUsedAbility}
											onclick={() => {
												if (abilityIdUsed === ability.id) {
													abilityIdUsed = null;
												} else {
													abilityIdUsed = ability.id;
												}
											}}
										>
											{#if ability.id === ABILITIES.CRIMSON_REAP}
												<Skull class="m-auto size-12" />
											{:else if ability.id === ABILITIES.CUTPURSE}
												<HandCoins class="m-auto size-12" />
											{:else if ability.id === ABILITIES.INFERNAL_RAGE}
												<Flame class="m-auto size-12" />
											{:else if ability.id === ABILITIES.PROTECTORS_OATH}
												<HandHeart class="m-auto size-12" />
											{/if}
										</button>
									{/if}
									<div class="flex flex-col justify-center">
										<p>{ability.name}</p>
										<p class=" text-sm text-gray-400">{ability.description}</p>
									</div>
								</div>
							{/each}
						</div>
						<input type="hidden" name="ability-id" id="ability-id" bind:value={abilityIdUsed} />
					{/if}
					<div class="col-span-6 max-w-28 sm:col-span-3">
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
		<h3 class="mb-6 mt-12 text-lg">Events:</h3>
		<GameLogs logs={data.logs} />
	</div>
</main>

<style lang="postcss">
	@property --a {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}

	.ability-button.active {
		@apply bg-clash-100/10;
	}

	.ability-button.active::before {
		content: '';
		position: absolute;
		inset: -2px;
		border: solid 4px;
		border-image: conic-gradient(
				from var(--a),
				transparent,
				transparent,
				rgb(252 211 77),
				transparent,
				transparent,
				rgb(252 211 77),
				transparent,
				transparent
			)
			1;
		filter: blur(1px);
		animation: gradientRotation 4s linear infinite;
	}

	@keyframes gradientRotation {
		to {
			--a: 1turn;
		}
	}
</style>
