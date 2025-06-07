<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/ToastStore.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LucideLoader2 } from 'lucide-svelte';

	const { data, form } = $props();
	const session = $state(data.session);
	const profile = $state(data.profile);
	let isLoading = $state(false);

	const username: string = profile?.username ?? '';
	let profileForm: HTMLFormElement | undefined = $state();

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
			<h2 class="text-foreground text-base leading-7 font-semibold">Profile</h2>
			<p class="text-muted-foreground mt-1 text-sm leading-6">
				This information will be displayed publicly so be careful what you share.
			</p>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-4">
					<div class="text-foreground block text-sm leading-6 font-medium">Email</div>
					<div class="mt-2">
						<div class="text-muted-foreground flex text-sm">
							{session?.user?.email ?? ''}
						</div>
					</div>
				</div>
				<div class="sm:col-span-4">
					<label for="username" class="text-foreground block text-sm leading-6 font-medium"
						>Username</label
					>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-white/10 ring-inset focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-inset"
						>
							<input
								type="text"
								name="username"
								id="username"
								autocomplete="username"
								value={form?.username ?? username}
								class="text-foreground flex-1 border-0 bg-transparent py-1.5 pl-2 focus:ring-0 sm:text-sm sm:leading-6"
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
			class="text-foreground rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
			disabled={isLoading}
			>{#if isLoading}
				<LucideLoader2 class="h-6 w-6 animate-spin" />
			{:else}
				Save{/if}</button
		>
	</div>
</form>
