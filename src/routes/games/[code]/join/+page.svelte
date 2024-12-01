<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { toast } from '$lib/stores/ToastStore';
	import { capitalize } from '$lib/utils/casing';
	import { formatTimeDelta } from '$lib/utils/dateUtils';
	import { generateNickName } from '$lib/utils/word-generator/generator';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Cog, LucideLoader2 } from 'lucide-svelte';

	export let data;
	let isLoading = false;

	// Game timer
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

	// Nickname generation
	let recentRefresh = false;
	let nickname = '';
	const handleNicknameRefresh = () => {
		recentRefresh = true;
		setTimeout(() => {
			recentRefresh = false;
		}, 1000);
		const newNickname = capitalize`${generateNickName()}`;
		newNickname.split('').forEach((_, i) => {
			setTimeout(() => {
				nickname = newNickname.slice(0, i + 1);
			}, i * 50);
		});
	};

	const handleNewPlayer: SubmitFunction = () => {
		isLoading = true;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.send({
					message: result.data?.message,
					type: 'success',
					duration: 5000
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

<header>
	<div class="mx-auto flex max-w-7xl flex-col gap-y-2 sm:px-6 lg:px-8">
		<h1 class="tracking-tigh text-3xl font-bold leading-tight text-white">
			Joining {data.gameName}
		</h1>
		<p class="text-pretty text-sm text-gray-300" title={data.endsAt}>
			Time remaining: {timeLeftText}
		</p>
	</div>
</header>

<main>
	<div class="mx-auto mt-5 max-w-7xl py-5 sm:px-6 lg:px-8">
		<form method="POST" action="?/joinGame" use:enhance={handleNewPlayer}>
			<input type="hidden" name="game-id" id="game-id" value={data.gameId} />
			<div class="col-span-3">
				<label for="nickname" class="block text-sm font-medium leading-6 text-white"
					>Choose your nickname or generate one clicking the cog:</label
				>
				<div class="mt-2">
					<div class="relative flex">
						<input
							type="text"
							name="nickname"
							id="nickname"
							autocomplete="name"
							value={nickname}
							required
							minlength="3"
							class="flex-1 border-b bg-transparent py-1.5 text-lg text-white transition-colors focus:border-b-clash-500 focus:outline-none md:text-4xl"
						/>
						<button
							class="absolute right-2 top-1/2 -translate-y-1/2"
							type="button"
							on:click={handleNicknameRefresh}
						>
							<span class="sr-only">Generate new nickname suggestion</span>
							<Cog
								class="size-6 origin-center text-slate-400 [animation-duration:1s] [animation-iteration-count:1] {recentRefresh
									? 'animate-spin'
									: null}"
							/>
						</button>
					</div>
				</div>
			</div>
			<Button class="mx-auto mt-8 max-w-fit" type="submit" disabled={isLoading}>
				{#if isLoading}
					<LucideLoader2 class="size-6 animate-spin" />
				{:else}
					Join game!
				{/if}
			</Button>
		</form>
	</div>
</main>
