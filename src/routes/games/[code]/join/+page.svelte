<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { toast } from '$lib/stores/ToastStore';
	import { capitalize } from '$lib/utils/casing';
	import { formatTimeDelta } from '$lib/utils/dateUtils';
	import { generateNickName } from '$lib/utils/word-generator/generator';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LucideLoader2, Shuffle } from 'lucide-svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	const { data } = $props();
	let isLoading = $state(false);

	// Game timer
	const millisecondsToEnd = new Date(data.endsAt).getTime();
	let millisecondsNow = new Date().getTime();
	let timeLeft = millisecondsToEnd - millisecondsNow;
	let timeLeftText = $state(timeLeft > 0 ? formatTimeDelta(timeLeft) : 'Game has ended');
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
	let recentRefresh = $state(false);
	let nickname = $state('');
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
				isLoading = false;
			}
			await update();
		};
	};
</script>

<header>
	<div class="mx-auto flex max-w-2xl flex-col gap-y-2 sm:px-6 lg:px-8">
		<h1 class="tracking-tigh text-foreground text-3xl leading-tight font-bold">
			Joining {data.gameName}
		</h1>
		<p class="text-muted-foreground text-sm text-pretty" title={data.endsAt}>
			Time remaining: {timeLeftText}
		</p>
	</div>
</header>

<main>
	<div class="mx-auto mt-5 max-w-2xl py-5 sm:px-6 lg:px-8">
		<form method="POST" action="?/joinGame" use:enhance={handleNewPlayer}>
			<input type="hidden" name="game-id" id="game-id" value={data.gameId} />
			<div class="col-span-3">
				<label for="nickname" class="text-foreground block text-sm leading-6 font-medium"
					>Choose your character name:</label
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
							class="focus:ring-ring ring-foreground/10 text-foreground hover:bg-muted flex-1 rounded-md border-b bg-transparent px-4 py-1.5 text-lg shadow-xs ring-1 transition-colors focus:ring-[3px] focus:outline-none md:text-4xl"
						/>
						<button
							class="absolute top-1/2 right-2 -translate-y-1/2"
							type="button"
							onclick={handleNicknameRefresh}
						>
							<span class="sr-only">Generate new nickname suggestion</span>
							<Shuffle
								class="text-foreground size-6 origin-center cursor-pointer [animation-duration:1s] [animation-iteration-count:1] {recentRefresh
									? 'animate-pulse'
									: null}"
							/>
						</button>
					</div>
				</div>
				{#if data.classes.length > 0}
					<div class="mt-8 space-y-4">
						<p class="text-foreground block text-sm leading-6 font-medium">
							Choose your class. Each active ability can only be used once per game:
						</p>
						<RadioGroup.Root value={data.classes.at(0)?.id.toString()} required name="class-id">
							{#each data.classes as classChoice (classChoice.id)}
								<div
									class="border-grey-200 focus-within:border-clash-500 flex items-center space-x-2 rounded-md border p-3 transition-colors"
								>
									<RadioGroup.Item
										value={classChoice.id.toString()}
										id={classChoice.id.toString()}
										aria-required="true"
									/>
									<Label for={classChoice.id.toString()} class="flex flex-col items-start"
										><p class="block text-lg font-bold">{classChoice.name}</p>
										{#each classChoice.abilities as ability (ability.id)}
											<p class="text-muted-foreground text-xs">
												<strong class="text-foreground">{ability.name}:</strong>
												{ability.description}
											</p>
										{/each}
									</Label>
								</div>
							{/each}
						</RadioGroup.Root>
					</div>
				{/if}
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
