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
	import Badge from '$lib/components/Badge.svelte';
	import { predefinedPersonalityPrompts } from './personalities';

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

	const endTime: string = form?.endTime?.toString() ?? '12:00';
	const cooldown: string = form?.cooldown?.toString() ?? '4';
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
	<div class="space-y-12">
		<div class="border-b border-white/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-white">Create an AuthentiClash game! ⚔️</h2>
			<p class="mt-1 text-sm leading-6 text-gray-400">
				You will get a shareable code after the game has been created.
			</p>
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="col-span-4 sm:col-span-6">
					<label for="game-name" class="block text-sm font-medium leading-6 text-white"
						>Game name</label
					>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-clash-500"
						>
							<input
								type="text"
								name="game-name"
								id="game-name"
								autocomplete="name"
								value={name}
								required
								minlength="3"
								class="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>

				<div class="col-span-6">
					<label for="2fa-cooldown" class="block text-sm font-medium leading-6 text-white"
						>2FA Entry Cooldown (0-24h)</label
					>
					<div class="text-xs text-gray-400">Limit how often players can enter 2FA values</div>
					<div class="mt-2 max-w-12">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-clash-500"
						>
							<input
								type="number"
								name="2fa-cooldown"
								id="2fa-cooldown"
								value={cooldown}
								required
								min="0"
								max="24"
								class="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>
				<div class="col-span-4 sm:col-span-3">
					<label for="end-date" class="block text-sm font-medium leading-6 text-white"
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
					<label for="game-name" class="block text-sm font-medium leading-6 text-white"
						>End time (UTC)</label
					>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-clash-500"
						>
							<input
								type="time"
								name="end-time"
								id="end-time"
								value={endTime}
								required
								class="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>
				<div class="col-span-6">
					<label
						for="commentator-personality"
						class="block text-sm font-medium leading-6 text-white"
						>AI commentator personality prompt</label
					>
					<p class="text-sm text-gray-400">
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
							class="flex-1 resize-none border-0 bg-white/5 px-2 py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
						/>
					</div>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each predefinedPersonalityPrompts as personality (personality.name)}
							<Button
								type="button"
								variant="outline"
								class="h-auto px-2 py-1 text-xs text-gray-300"
								onclick={() => (commentatorPersonality = personality.prompt)}
							>
								{personality.name}
							</Button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex items-center gap-x-6">
		<button
			type="submit"
			class="rounded-md bg-clash-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
			disabled={isLoading}>{isLoading ? 'Creating...' : 'Create'}</button
		>
	</div>
</form>
