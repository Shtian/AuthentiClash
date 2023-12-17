<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData } from './$types.js';
	import { fade, fly } from 'svelte/transition';
	import { quadIn, quadOut } from 'svelte/easing';
	import { goto } from '$app/navigation';

	export let form: ActionData;
	$: ({ error, success, registeredEmail } = form ?? {
		error: '',
		success: false,
		registeredEmail: ''
	});

	const animationDuration = 150;
	let password = '';
	let email = form?.email ?? '';
	let loading = false;
	let showRegister = false;

	function getEmailParam(email: string) {
		return email ? `?email=${encodeURIComponent(email)}` : '';
	}

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			password = '';
			showRegister = false;
			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}
		};
	};
</script>

<div class="flex min-h-full flex-col justify-center">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img
			class="mx-auto h-10 w-auto"
			src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
			alt="Your Company"
		/>
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
			{showRegister ? 'Create your account' : 'Sign in to your account'}
		</h2>
	</div>
	{#if error}
		<div
			in:fade
			class="mt-10 sm:mx-auto sm-w-full sm:max-w-sm text-white ring-1 rounded-md px-4 py-2 ring-red-300 flex items-center gap-x-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-8 h-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
				/>
			</svg>
			Error logging in: {error}
		</div>
	{/if}
	{#if success}
		<div
			in:fade
			class="mt-10 sm:mx-auto sm-w-full sm:max-w-sm text-white ring-1 rounded-md px-4 py-2 ring-green-300 flex items-center gap-x-2"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-8 h-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
				/>
			</svg>
			Success! A verification email has been sent to {registeredEmail}.
		</div>
	{/if}
	{#if !showRegister}
		<div
			class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
			in:fly={{
				delay: animationDuration,
				duration: animationDuration,
				opacity: 0,
				x: -400,
				easing: quadIn
			}}
			out:fly={{
				duration: animationDuration,
				opacity: 0,
				x: -400,
				easing: quadOut
			}}
		>
			<form class="space-y-6" use:enhance={handleSubmit} method="POST" action="?/signIn">
				<div>
					<label for="email" class="block text-sm font-medium leading-6 text-white"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							bind:value={email}
							required
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label for="password" class="block text-sm font-medium leading-6 text-white"
							>Password</label
						>
						<div class="text-sm">
							<a
								href={`/auth/forgot${getEmailParam(email)}`}
								class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a
							>
						</div>
					</div>
					<div class="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							bind:value={password}
							required
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
						>{loading ? 'Signing in...' : 'Sign in'}</button
					>
				</div>
			</form>
			<p class="mt-10 text-center text-sm text-gray-400">
				Not a member?
				<button
					class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
					on:click={() => {
						showRegister = true;
						error = '';
					}}>Register</button
				>
			</p>
		</div>
	{:else}
		<div
			class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
			in:fly={{ delay: animationDuration, duration: animationDuration, opacity: 0, x: 400 }}
			out:fly={{
				duration: animationDuration,
				opacity: 0,
				x: 400
			}}
		>
			<form class="space-y-6" use:enhance={handleSubmit} method="POST" action="?/signUp">
				<div>
					<label for="email" class="block text-sm font-medium leading-6 text-white"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							bind:value={email}
							required
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center">
						<label for="password" class="block text-sm font-medium leading-6 text-white"
							>Password</label
						>
					</div>
					<div class="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							bind:value={password}
							required
							minlength="6"
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
						>{loading ? 'Signing up...' : 'Sign up'}</button
					>
				</div>
			</form>
			<p class="mt-10 text-center text-sm text-gray-400">
				Already a member?
				<button
					class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
					on:click={() => {
						showRegister = false;
						error = '';
					}}>Sign in</button
				>
			</p>
		</div>
	{/if}
</div>
