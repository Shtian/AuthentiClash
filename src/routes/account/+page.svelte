<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { run } from 'svelte/legacy';

	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/ToastStore.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LucideLoader2 } from 'lucide-svelte';

	let { data, form } = $props();

	let { session, profile } = $state(data);
	run(() => {
		({ session, profile } = data);
	});

	let profileForm: HTMLFormElement = $state();
	let isLoading = $state(false);
	let username: string = profile?.username ?? '';

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
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
</script>

<form method="POST" action="?/update" use:enhance={handleSubmit} bind:this={profileForm}>
	<div class="space-y-12">
		<div class="border-b border-white/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-white">Profile</h2>
			<p class="mt-1 text-sm leading-6 text-gray-400">
				This information will be displayed publicly so be careful what you share.
			</p>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-4">
					<div class="block text-sm font-medium leading-6 text-white">Email</div>
					<div class="mt-2">
						<div class="flex text-sm text-gray-300">
							{session.user.email}
						</div>
					</div>
				</div>
				<div class="sm:col-span-4">
					<label for="username" class="block text-sm font-medium leading-6 text-white"
						>Username</label
					>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500"
						>
							<input
								type="text"
								name="username"
								id="username"
								autocomplete="username"
								value={form?.username ?? username}
								class="flex-1 border-0 bg-transparent py-1.5 pl-2 text-white focus:ring-0 sm:text-sm sm:leading-6"
								minlength="3"
								required
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
			class="rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
			disabled={isLoading}
			>{#if isLoading}
				<LucideLoader2 class="h-6 w-6 animate-spin" />
			{:else}
				Save{/if}</button
		>
	</div>
</form>
