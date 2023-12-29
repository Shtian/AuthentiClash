<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;
	export let form;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	let profileForm: HTMLFormElement;
	let loading = false;
	let fullName: string = profile?.full_name ?? '';
	let username: string = profile?.username ?? '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};
</script>

<form method="post" action="?/update" use:enhance={handleSubmit} bind:this={profileForm}>
	<div class="space-y-12">
		<div class="border-b border-white/10 pb-12">
			<h2 class="text-base font-semibold leading-7 text-white">Profile</h2>
			<p class="mt-1 text-sm leading-6 text-gray-400">
				This information will be displayed publicly so be careful what you share.
			</p>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-4">
					<label for="email" class="block text-sm font-medium leading-6 text-white">Email</label>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500"
						>
							<input
								type="text"
								name="email"
								id="email"
								autocomplete="email"
								value={session.user.email}
								disabled
								class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>
				</div>
				<div class="sm:col-span-4">
					<label for="full-name" class="block text-sm font-medium leading-6 text-white"
						>Full name</label
					>
					<div class="mt-2">
						<div
							class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500"
						>
							<input
								type="text"
								name="full-name"
								id="full-name"
								autocomplete="name"
								value={form?.fullName ?? fullName}
								class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
							/>
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
								class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
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
			disabled={loading}>{loading ? 'Saving...' : 'Save'}</button
		>
	</div>
</form>
