<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Calendar as CalendarIcon } from 'lucide-svelte';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		today,
		parseDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/ToastStore.js';
	import AbilityAnnouncement from '$lib/components/AbilityAnnouncement.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	let { form } = $props();

	let name = '';
	let endDate: DateValue | undefined = $state(
		form?.endDate ? parseDate(form.endDate.toString()) : today(getLocalTimeZone()).add({ days: 1 })
	);
	let contentRef = $state<HTMLElement | null>(null);

	let endTime: string = form?.endTime?.toString() ?? '12:00';
	let cooldown: string = form?.cooldown?.toString() ?? '4';
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
					<div class="text-xs text-gray-300">Limit how often players can enter 2FA values</div>
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
								class="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
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
										class: 'w-[280px] justify-start text-left font-normal'
									}),
									!endDate && 'text-muted-foreground'
								)}
							>
								<CalendarIcon />
								{endDate ? df.format(endDate.toDate(getLocalTimeZone())) : 'Pick a date'}
							</Popover.Trigger>
							<Popover.Content bind:ref={contentRef} class="w-auto p-0">
								<Calendar
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
