<script lang="ts">
	import type { ActionData } from './$types.js';
	import { fly } from 'svelte/transition';
	import { quadIn, quadOut } from 'svelte/easing';
	import InlineMessage from '$lib/components/InlineMessage.svelte';
	import logo from '$lib/assets/authenticlash_logo.svg';

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

	const setLoadingState = () => {
		loading = true;
	};
</script>

<div class="flex min-h-full flex-col justify-center">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<img class="mx-auto h-10 w-auto" src={logo} alt="AuthentiClash logo" />
		<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
			{showRegister ? 'Create your account' : 'Sign in to your account'}
		</h2>
	</div>
	{#if error}
		<InlineMessage msgType="error">Error logging in: {error}</InlineMessage>
	{/if}
	{#if success}
		<InlineMessage msgType="success">
			Success! A verification email has been sent to {registeredEmail}.
		</InlineMessage>
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
			<form class="space-y-6" method="POST" action="?/signIn" on:submit={setLoadingState}>
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
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-clash-500 sm:text-sm sm:leading-6"
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
								class="font-semibold text-clash-400 hover:text-clash-300">Forgot password?</a
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
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-clash-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
						>{loading ? 'Signing in...' : 'Sign in'}</button
					>
				</div>
			</form>
			<p class="mt-10 text-center text-sm text-gray-400">
				Not a member?
				<button
					class="font-semibold leading-6 text-clash-400 hover:text-clash-300"
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
			<form class="space-y-6" method="POST" action="?/signUp" on:submit={setLoadingState}>
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
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-clash-500 sm:text-sm sm:leading-6"
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
							class="block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-clash-500 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="flex w-full justify-center rounded-md bg-clash-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
						>{loading ? 'Signing up...' : 'Sign up'}</button
					>
				</div>
			</form>
			<p class="mt-10 text-center text-sm text-gray-400">
				Already a member?
				<button
					class="font-semibold leading-6 text-clash-400 hover:text-clash-300"
					on:click={() => {
						showRegister = false;
						error = '';
					}}>Sign in</button
				>
			</p>
		</div>
	{/if}
</div>
