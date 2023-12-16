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

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<div class="py-10">
	<header>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Games</h1>
		</div>
	</header>
	<main>
		<div class="mx-auto max-w-7xl sm:px-6 lg:px-8 py-10">
			<form method="post" action="?/update" use:enhance={handleSubmit} bind:this={profileForm}>
				<div>
					<label for="email">Email</label>
					<input id="email" type="text" value={session.user.email} disabled />
				</div>

				<div>
					<label for="fullName">Full Name</label>
					<input id="fullName" name="fullName" type="text" value={form?.fullName ?? fullName} />
				</div>

				<div>
					<label for="username">Username</label>
					<input id="username" name="username" type="text" value={form?.username ?? username} />
				</div>

				<div>
					<input
						type="submit"
						class=""
						value={loading ? 'Loading...' : 'Update'}
						disabled={loading}
					/>
				</div>
			</form>

			<form method="post" action="?/signout" use:enhance={handleSignOut}>
				<div>
					<button class="button block" disabled={loading}>Sign Out</button>
				</div>
			</form>
		</div>
	</main>
</div>
