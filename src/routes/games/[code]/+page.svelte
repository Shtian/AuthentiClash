<script lang="ts">
	import InlineMessage from '$lib/components/InlineMessage.svelte';
	import { page } from '$app/state';
	import { formatTimeDelta, timeUntilDailyCooldownEnds } from '$lib/utils/dateUtils.js';
	import GameHighScore from './GameHighScore.svelte';
	import {
		Clock,
		Crosshair,
		Dices,
		Flame,
		HandCoins,
		HandHeart,
		LucideLoader2,
		Shield,
		Skull
	} from 'lucide-svelte';
	import Cooldown from './Cooldown.svelte';
	import { Button } from '$lib/components/ui/button';
	import { onDestroy } from 'svelte';
	import { toast } from '$lib/stores/ToastStore';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { ABILITIES } from '$lib/classes/abilities';
	import GameLogs from './GameLogs.svelte';
	import type { Participation } from '$lib/supabase/participation';
	import type { PageData } from './$types';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Badge } from '$lib/components/ui/badge';
	import type { Ability } from '$lib/supabase/classes';
	import GamePageHeader from './GamePageHeader.svelte';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	const { data }: { data: PageData } = $props();
	let isLoading = $state(false);
	let abilityIdUsed: number | null = $state(null);
	const hasUsedAbility = $derived(
		data.players?.find((x: Participation) => x.profileId === data.session?.user.id)?.abilityUsed !==
			null
	);
	const players = $derived(data.players);

	let cooldownRemaining = $state(timeUntilDailyCooldownEnds(data.currentPlayer?.updatedAt));

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
					cooldownRemaining = timeUntilDailyCooldownEnds(new Date().toISOString());
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

<main>
	<GamePageHeader
		gameName={data.gameName}
		endsAt={data.endsAt}
		aiEnabled={data.aiEnabled}
		{timeLeftText}
		hasEnded={timeLeft <= 0}
	/>
	<div
		class="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-x-4 gap-y-12 py-5 md:mt-12 md:grid-cols-2 md:gap-8"
	>
		{#if timeLeft > 0}
			<form method="POST" action="?/updateScore" use:enhance={handleNewScore}>
				<input type="hidden" name="game-id" id="game-id" value={data.gameId} />
				<input type="hidden" name="ability-id" id="ability-id" value={abilityIdUsed} />

				<div class="space-y-6">
					<div class="space-y-2">
						<label for="2fa-score" class="block text-center text-2xl font-bold"
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
												class:grayscale={hasUsedAbility && !isAbilityPassive(ability)}
											>
												{#if ability.id === ABILITIES.DIVINE_AEGIS}
													<Shield class="m-auto size-8" />
												{:else if ability.id === ABILITIES.CRIMSON_REAP}
													<Skull class="m-auto size-8" />
												{:else if ability.id === ABILITIES.CUTPURSE}
													<HandCoins class="m-auto size-8" />
												{:else if ability.id === ABILITIES.INFERNAL_RAGE}
													<Flame class="m-auto size-8" />
												{:else if ability.id === ABILITIES.PROTECTORS_OATH}
													<HandHeart class="m-auto size-8" />
												{:else if ability.id === ABILITIES.FINAL_WAGER}
													<Crosshair class="m-auto size-8" />
												{:else if ability.id === ABILITIES.FATEFUL_FLICK}
													<Dices class="m-auto size-8" />
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
											{#if hasUsedAbility && !isAbilityPassive(ability)}
												<p class="mt-2 text-xs font-medium text-red-400">⚠️ Ability already used</p>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/each}
						<input type="hidden" name="ability-id" id="ability-id" bind:value={abilityIdUsed} />
					{/if}
					<div class="relative col-span-6 sm:col-span-3">
						{#if cooldownRemaining <= 0}
							<Button
								type="submit"
								size="lg"
								class="bg-clash-500 hover:bg-clash-400 dark:bg-clash-500 dark:hover:bg-clash-400 w-full text-white"
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
						{#if !hasUsedAbility && abilityIdUsed}
							<div
								transition:fly={{ duration: 300, easing: quintOut, y: -20 }}
								class="absolute right-0 -bottom-6 left-0 text-center text-xs text-slate-500"
							>
								✨ Active ability will be used with this attack
							</div>
						{/if}
					</div>
				</div>
			</form>
		{:else}
			<div class="flex flex-col items-center gap-2">
				<h2 class="text-foreground text-2xl font-bold">Enter 2FA Code</h2>
				<p class="text-muted-foreground text-center text-sm">
					Game has ended. You can still view the game logs and high scores.
				</p>
			</div>
		{/if}
		<GameHighScore
			{players}
			currentPlayerId={data.session?.user.id}
			aiEnabled={data.aiEnabled}
			gameId={data.gameId}
		/>
		<div class="flex justify-center md:col-span-2">
			<div class="w-full max-w-lg">
				<GameLogs logs={data.logs} />
			</div>
		</div>
	</div>
</main>
