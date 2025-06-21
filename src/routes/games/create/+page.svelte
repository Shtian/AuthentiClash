<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Calendar as CalendarIcon, Sparkles } from 'lucide-svelte';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		today,
		parseDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/ToastStore.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { predefinedPersonalityPrompts } from './personalities';
	import { predefinedBackgroundPrompts } from './backgrounds';
	import { Badge } from '$lib/components/ui/badge';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	const { form } = $props();

	const name = '';
	let endDate = $state<DateValue | undefined>(
		form?.endDate ? parseDate(form.endDate.toString()) : today(getLocalTimeZone()).add({ days: 1 })
	);
	let contentRef = $state<HTMLElement | null>(null);

	let commentatorPersonality = $state<string>('');
	let backgroundPrompt = $state<string>('');

	const endTime: string = form?.endTime?.toString() ?? '12:00';
	const cooldown: string = form?.cooldown?.toString() ?? '16';
	let isLoading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		return async ({ result }) => {
			if (result.type === 'redirect') {
				goto(result.location);
			}
			if (result.type === 'failure') {
				toast.send({
					message: result.data?.message,
					type: 'error'
				});
				isLoading = false;
			}
			await applyAction(result);
		};
	};
</script>

<form method="POST" action="?/create" use:enhance={handleSubmit}>
	<div class="mx-auto max-w-2xl space-y-12">
		<div class="border-foreground/10 border-b pb-12">
			<h2 class="text-foreground text-base leading-7 font-semibold">
				Create an AuthentiClash game! ⚔️
			</h2>
			<p class="text-muted-foreground mt-1 text-sm leading-6">
				You will get a shareable code after the game has been created.
			</p>
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="col-span-4 sm:col-span-6">
					<label for="game-name" class="text-foreground block text-sm leading-6 font-medium"
						>Game name</label
					>
					<div class="mt-2">
						<div
							class="hover:bg-muted ring-foreground/10 focus-within:ring-ring flex rounded-md bg-white/5 shadow-2xs ring-1 ring-inset focus-within:ring-2"
						>
							<input
								type="text"
								name="game-name"
								id="game-name"
								autocomplete="name"
								value={name}
								required
								minlength="3"
								class="text-foreground flex-1 border-0 bg-transparent py-1.5 pl-2 focus:outline-0 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>

				<div class="col-span-6">
					<label for="2fa-cooldown" class="text-foreground block text-sm leading-6 font-medium"
						>2FA Entry Cooldown (0-24h)</label
					>
					<div class="text-muted-foreground text-xs">
						Limit how often players can enter 2FA values
					</div>
					<div class="mt-2 max-w-12">
						<div
							class="focus-within:ring-ring ring-foreground/10 hover:bg-muted flex rounded-md bg-white/5 shadow-2xs ring-1 ring-inset focus-within:ring-2 focus-within:ring-inset"
						>
							<input
								type="number"
								name="2fa-cooldown"
								id="2fa-cooldown"
								value={cooldown}
								required
								min="0"
								max="24"
								class="text-foreground flex-1 border-0 bg-transparent py-1.5 pl-2 focus:outline-0 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>
				<div class="col-span-4 sm:col-span-3">
					<label for="end-date" class="text-foreground block text-sm leading-6 font-medium"
						>End date</label
					>
					<div class="w-fu mt-2">
						<input type="hidden" name="end-date" id="end-date" bind:value={endDate} />
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({
										variant: 'outline',
										class: 'w-full justify-start bg-white/5 text-left font-normal'
									}),
									!endDate && 'text-muted-foreground'
								)}
							>
								<CalendarIcon />
								{endDate ? df.format(endDate.toDate(getLocalTimeZone())) : 'Pick a date'}
							</Popover.Trigger>
							<Popover.Content bind:ref={contentRef} class="w-auto p-0">
								<Calendar
									type="single"
									bind:value={endDate}
									weekStartsOn={1}
									minValue={today(getLocalTimeZone())}
								/>
							</Popover.Content>
						</Popover.Root>
					</div>
				</div>
				<div class="col-span-4 sm:col-span-3">
					<label for="game-name" class="text-foreground block text-sm leading-6 font-medium"
						>End time (UTC)</label
					>
					<div class="mt-2">
						<div
							class="focus-within:ring-ring ring-foreground/10 hover:bg-muted flex rounded-md bg-white/5 shadow-2xs ring-1 ring-inset focus-within:ring-[3px]"
						>
							<input
								type="time"
								name="end-time"
								id="end-time"
								value={endTime}
								required
								class="text-foreground flex-1 border-0 bg-transparent py-1.5 pl-2 focus:outline-0 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>
				<div class="col-span-6">
					<label
						for="commentator-personality"
						class="text-foreground block text-sm leading-6 font-medium"
						>AI commentator personality prompt</label
					>
					<p class="text-muted-foreground text-sm">
						Use a prompt that describes the personality of the commentator, or choose a pre-defined
						personality below.
					</p>
					<div class="mt-2">
						<Textarea
							name="commentator-personality"
							id="commentator-personality"
							bind:value={commentatorPersonality}
							maxlength={512}
							required
							class="text-foreground ring-foreground/10 hover:bg-muted flex-1 resize-none border-0 px-2 py-1.5 shadow-2xs ring-1 ring-inset focus:ring-[3px] focus:outline-0 sm:text-sm sm:leading-6"
						/>
					</div>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each predefinedPersonalityPrompts as personality (personality.name)}
							<Button
								type="button"
								variant="outline"
								class="text-muted-foreground h-auto px-2 py-1 text-xs"
								onclick={() => (commentatorPersonality = personality.prompt)}
							>
								{personality.name}
							</Button>
						{/each}
					</div>
				</div>
				<div class="col-span-6">
					<label for="background-prompt" class="text-foreground block text-sm leading-6 font-medium"
						>AI avatar background prompt<Badge
							variant="secondary"
							class="dark:bg-clash-400 bg-clash-200 ml-2 text-xs"
							><Sparkles class="size-3" />New</Badge
						></label
					>
					<p class="text-muted-foreground text-sm">
						Use a prompt that describes the background theme for AI-generated avatars, or choose a
						pre-defined background below. Leave empty for random backgrounds.
					</p>
					<div class="mt-2">
						<Textarea
							name="background-prompt"
							id="background-prompt"
							bind:value={backgroundPrompt}
							maxlength={512}
							placeholder="Leave empty for random backgrounds"
							class="text-foreground ring-foreground/10 hover:bg-muted flex-1 resize-none border-0 px-2 py-1.5 shadow-2xs ring-1 ring-inset focus:ring-[3px] focus:outline-0 sm:text-sm sm:leading-6"
						/>
					</div>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each predefinedBackgroundPrompts as background (background.name)}
							<Button
								type="button"
								variant="outline"
								class="text-muted-foreground h-auto px-2 py-1 text-xs"
								onclick={() => (backgroundPrompt = background.prompt)}
							>
								{background.name}
							</Button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto mt-6 flex max-w-2xl items-center gap-x-6">
		<button
			type="submit"
			class="bg-clash-400 hover:bg-clash-300 focus-visible:outline-clash-500 text-foreground rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
			disabled={isLoading}>{isLoading ? 'Creating...' : 'Create'}</button
		>
	</div>
</form>
