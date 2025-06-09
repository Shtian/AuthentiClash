<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/ToastStore';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Loader2, Sparkles, TrendingUp } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import * as Popover from '$lib/components/ui/popover';
	import ScoreGraph from '$lib/components/ScoreGraph.svelte';
	import type { Participation } from '$lib/supabase/participation';
	import { getClassName } from '$lib/classes/classes';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		players?: Participation[];
		aiEnabled?: boolean;
		currentPlayerId?: string;
	}

	const { players = [], aiEnabled = false, currentPlayerId = '' }: Props = $props();

	let isLoading = $state(false);

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

	const getRankColor = (rank: number) => {
		switch (rank) {
			case 1:
				return 'text-yellow-400';
			case 2:
				return 'text-gray-300';
			case 3:
				return 'text-amber-600';
			default:
				return 'text-slate-400';
		}
	};

	const getUsername = (player: Participation) => {
		const [, username = ''] = player.nickname.split('(');
		return username.replace(/[()]/g, '').trim();
	};
	const getNickname = (player: Participation) => {
		const [nickname] = player.nickname.split('(');
		return nickname.replace(/[()]/g, '').trim();
	};
</script>

<section class="mx-4 flow-root space-y-8 sm:mx-0 md:space-y-9">
	<h2 class="text-center text-2xl font-bold">🏆 Leaderboard</h2>
	<div class="inline-block min-w-full space-y-2 align-middle">
		{#each players.sort((a, b) => b.totalScore - a.totalScore) as player, i (player.profileId)}
			<div
				class={`grid grid-cols-[auto_auto_1fr_auto] items-center gap-4 rounded-lg border p-4 shadow-sm transition-all dark:border-slate-600  ${
					player.profileId === currentPlayerId
						? 'bg-foreground/5 dark:bg-slate-500/50'
						: 'dark:bg-slate-800/80 dark:hover:bg-slate-700/50'
				}`}
				animate:flip={{ duration: 300 }}
			>
				<div class="w-12 text-center">
					<span
						class={`text-shadow-muted-foreground/50  text-xl font-bold text-shadow-2xs ${getRankColor(i + 1)}`}
						>#{i + 1}</span
					>
				</div>
				<div>
					{#if player.nicknameImageUrl}
						<Popover.Root>
							<Popover.Trigger class="size-11 shrink-0">
								<img
									src={`${player.nicknameImageUrl.replace('.webp', '-128.webp')}`}
									alt={player.nickname}
									class="size-11 rounded-full"
								/>
							</Popover.Trigger>
							<Popover.Content>
								<a href={player.nicknameImageUrl} class="mt-6 underline hover:no-underline">
									<img
										src={`${player.nicknameImageUrl.replace('.webp', '-512.webp')}`}
										width={256}
										height={256}
										alt={player.nickname}
										class="size-64"
									/>
								</a>
								{#if player.classId}
									Class: {getClassName(player.classId)}
								{/if}
							</Popover.Content>
						</Popover.Root>
					{:else if isLoading && player.profileId === currentPlayerId}
						<Loader2 class="text-muted-foreground size-6 animate-spin"></Loader2>
					{:else if aiEnabled && player.profileId === currentPlayerId}
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
								class="hover:text-foreground text-muted-foreground transition-colors"
							>
								<span class="sr-only">Generate participant image</span>
								<Sparkles class="size-6" />
							</button>
						</form>
					{:else}
						<Popover.Root>
							<Popover.Trigger class="shrink-0">
								<img
									src={`https://api.dicebear.com/8.x/adventurer/svg?size=256&seed=${encodeURIComponent(
										player.nickname
									)}`}
									alt={player.nickname}
									class="size-11 rounded-full"
								/>
							</Popover.Trigger>
							<Popover.Content
								><img
									src={`https://api.dicebear.com/8.x/adventurer/svg?size=256&seed=${encodeURIComponent(
										player.nickname
									)}`}
									width={256}
									height={256}
									alt={player.nickname}
									class="size-48 w-full"
								/>
								{#if player.classId}
									Class: {getClassName(player.classId)}
								{/if}
							</Popover.Content>
						</Popover.Root>
					{/if}
				</div>
				<div class="min-w-0">
					<div class="text-foreground truncate font-semibold">{getNickname(player)}</div>
					<div class="text-muted-foreground truncate text-sm">{getUsername(player)}</div>
				</div>
				<div class="flex items-center space-x-3">
					<div class="text-right">
						<div class="text-foreground text-lg font-bold">{player.totalScore}</div>
						<div class="text-muted-foreground text-xs">points</div>
					</div>
					<Popover.Root>
						<Popover.Trigger
							><Button variant="outline" class=""
								><span class="sr-only">Show scores</span>
								<TrendingUp class="size-4" />
							</Button></Popover.Trigger
						>
						<Popover.Content
							><ScoreGraph allScores={player.score} width={250} height={130} /></Popover.Content
						>
					</Popover.Root>
				</div>
			</div>
		{:else}
			<div>
				<div class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-2">
					-
				</div>
				<div class="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">-</div>
				<div class="whitespace">
					<span class="text-sm text-muted-foreground">No scores yet</span>
				</div>
			</div>
		{/each}
	</div>
</section>
