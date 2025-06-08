<script lang="ts">
	import InlineMessage from '$lib/components/InlineMessage.svelte';
	import { page } from '$app/state';
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
	import { Button } from '$lib/components/ui/button';
	import { onDestroy } from 'svelte';
	import { toast } from '$lib/stores/ToastStore';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import * as Popover from '$lib/components/ui/popover';
	import { ABILITIES } from '$lib/classes/abilities';
	import GameLogs from './GameLogs.svelte';
	import type { Participation } from '$lib/supabase/participation';
	import type { PageData } from './$types';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Badge } from '$lib/components/ui/badge';
	import type { Ability } from '$lib/supabase/classes';

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

	const isAbilityPassive = (ability: Ability) => {
		return ability.description.startsWith('(Passive)');
	};

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

{#if page.error}
	<InlineMessage msgType="error">{page.error.message}</InlineMessage>
{/if}

<header>
	<div class="mx-auto flex max-w-7xl flex-col gap-y-2 sm:px-6 lg:px-8">
		<div class="flex flex-row gap-2">
			<h1 class="tracking-tigh text-foreground text-3xl leading-tight font-bold">
				{data.gameName}
			</h1>
			<button
				type="submit"
				class="hover:text-clash-400 focus-visible:outline-clash-500 text-foreground relative inline-flex items-center gap-x-2 self-center rounded-md bg-transparent px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
				onclick={copyUrl}
			>
				<Copy />
				{#if urlIsRecentlyCopied}
					<span class="text-foreground absolute -bottom-3.5 text-sm" in:fade out:fade>Copied!</span>
				{/if}
			</button>
		</div>
		<p class="text-muted-foreground text-sm text-pretty tabular-nums" title={data.endsAt}>
			Ends in: {timeLeftText}
		</p>
		{#if data.aiEnabled}
			<Popover.Root>
				<Popover.Trigger class="w-max">
					<div class="rounded-md px-1.5 py-0.5 text-xs font-medium ring-1">
						<Sparkles class="inline size-4" /> AI enabled
					</div>
				</Popover.Trigger>
				<Popover.Content class="text-sm text-pretty">
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

				<div class="mt-4 space-y-6">
					<div class="space-y-6">
						<label
							for="2fa-score"
							class="text-foreground block text-center text-2xl leading-6 font-medium"
							>Enter 2FA Code</label
						>
						<p class="text-muted-foreground text-center text-sm">
							Input your two-digit authentication code
						</p>
						<input
							type="number"
							name="2fa-score"
							id="2fa-score"
							required
							placeholder="00"
							min="10"
							max="99"
							autocomplete="off"
							class="ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring text-foreground hover:bg-foreground/5 flex h-16 w-full rounded-md border px-3 py-2 text-center text-3xl font-bold tracking-widest shadow-2xs file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800/50"
						/>
					</div>
					{#if data.class}
						{#each data.class.abilities as ability (ability.id)}
							<div
								class={`rounded-lg border shadow-2xs transition-all duration-300 dark:bg-zinc-800/50 ${
									!hasUsedAbility && abilityIdUsed === ability.id
										? 'border-clash-500 shadow-clash-500/25 ring-clash-500/50 dark:border-clash-500 shadow-lg ring-2'
										: 'border-foreground/10 dark:border-zinc-600'
								}`}
							>
								<div class="p-4">
									<div class="flex items-start space-x-3">
										<div class="mt-1 flex-shrink-0">
											<div
												class="to-clash-600 flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 text-white"
												class:grayscale={hasUsedAbility}
											>
												{#if isAbilityPassive(ability)}
													<Shield class="m-auto size-8" />
												{:else if ability.id === ABILITIES.CRIMSON_REAP}
													<Skull class="m-auto size-8" />
												{:else if ability.id === ABILITIES.CUTPURSE}
													<HandCoins class="m-auto size-8" />
												{:else if ability.id === ABILITIES.INFERNAL_RAGE}
													<Flame class="m-auto size-8" />
												{:else if ability.id === ABILITIES.PROTECTORS_OATH}
													<HandHeart class="m-auto size-8" />
												{/if}
											</div>
										</div>
										<div class="min-w-0 flex-1">
											<div class="mb-2 flex items-center justify-between">
												<div class="flex items-center gap-2">
													<h3 class="text-foreground font-semibold">{ability.name}</h3>
													<Badge
														variant="secondary"
														class={`text-xs ${
															isAbilityPassive(ability)
																? 'border-purple-600/30 bg-purple-600/20 text-purple-400'
																: 'border-emerald-600/30 bg-emerald-600/20 text-emerald-400'
														}`}
													>
														{#if isAbilityPassive(ability)}
															Passive
														{:else}
															Active
														{/if}</Badge
													>
												</div>
												{#if !isAbilityPassive(ability)}
													<div class="flex items-center space-x-2">
														<Checkbox
															id="ability-toggle"
															checked={!hasUsedAbility && abilityIdUsed === ability.id}
															onCheckedChange={() => {
																if (abilityIdUsed === ability.id) {
																	abilityIdUsed = null;
																} else {
																	abilityIdUsed = ability.id;
																}
															}}
															disabled={hasUsedAbility}
															class="peer border-zinc-500 disabled:cursor-not-allowed"
														/>
														<label
															for="ability-toggle"
															class="text-foreground peer-disabled:text-muted-foreground text-sm font-medium peer-disabled:cursor-not-allowed"
															>Activate</label
														>
													</div>
												{/if}
											</div>
											<p class="text-foreground text-sm leading-relaxed">
												{ability.description}
											</p>
											{#if hasUsedAbility}
												<p class="mt-2 text-xs font-medium text-red-400">⚠️ Ability already used</p>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/each}
						<input type="hidden" name="ability-id" id="ability-id" bind:value={abilityIdUsed} />
					{/if}
					<div class="col-span-6 sm:col-span-3">
						{#if cooldownRemaining <= 0}
							<Button
								type="submit"
								size="lg"
								class="bg-clash-600 hover:bg-clash-200 dark:bg-clash-500 dark:hover:bg-clash-400 text-foreground w-full"
								disabled={isLoading}
							>
								{#if isLoading}
									<LucideLoader2 class="size-6 animate-spin" />
								{:else}
									{data.currentPlayer ? 'Add Score' : 'Join Game'}
								{/if}
							</Button>
						{:else}
							<Button type="submit" size="lg" class="w-full" disabled>
								<Clock class="mr-2 size-4 shrink-0" />
								<Cooldown bind:delta={cooldownRemaining}></Cooldown>
							</Button>
						{/if}
					</div>
					{#if !hasUsedAbility && abilityIdUsed}
						<div class="text-center text-xs text-slate-500">
							✨ Active ability will be used with this attack
						</div>
					{/if}
				</div>
			</form>
		{:else}
			<p class="text-foreground">Final scores:</p>
		{/if}
		<GameHighScore {players} currentPlayerId={data.session?.user.id} aiEnabled={data.aiEnabled} />
		<h3 class="mt-12 mb-6 text-lg">Events:</h3>
		<GameLogs logs={data.logs} />
	</div>
</main>

<style lang="postcss">
	@property --a {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
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
