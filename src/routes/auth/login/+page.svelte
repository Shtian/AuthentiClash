<script lang="ts">
	import type { ActionData, PageData } from './$types.js';
	import { fly } from 'svelte/transition';
	import { quadIn, quadOut } from 'svelte/easing';
	import InlineMessage from '$lib/components/InlineMessage.svelte';
	import logo from '$lib/assets/authenticlash_logo.svg';
	import AuthProviders from './AuthProviders.svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	const { data, form }: Props = $props();
	const supabase = $state(data.supabase);

	const animationDuration = 150;
	let password = $state('');
	let email = $state(form?.email ?? '');
	const success = $state(false);
	const registeredEmail = $state('');
	let loading = $state(false);
	let showRegister = $state(false);
	let error = $state<string | undefined>(form?.error);

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
		<h2 class="mt-10 text-center text-2xl leading-9 font-bold tracking-tight text-white">
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
			<form class="space-y-6" method="POST" action="?/signIn" onsubmit={setLoadingState}>
				<div>
					<label for="email" class="block text-sm leading-6 font-medium text-white"
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
							class="focus:ring-clash-500 block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-white/10 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label for="password" class="block text-sm leading-6 font-medium text-white"
							>Password</label
						>
						<div class="text-sm">
							<a
								href={`/auth/forgot${getEmailParam(email)}`}
								class="text-clash-400 hover:text-clash-300 font-semibold">Forgot password?</a
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
							class="focus:ring-clash-500 block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-white/10 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="bg-clash-500 hover:bg-clash-400 focus-visible:outline-clash-500 flex w-full justify-center rounded-md px-3 py-1.5 text-sm leading-6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
						>{loading ? 'Signing in...' : 'Sign in'}</button
					>
				</div>
			</form>
			<hr class="my-4" />
			<AuthProviders {supabase} />
			<p class="mt-10 text-center text-sm text-gray-400">
				Not a member?
				<button
					class="text-clash-400 hover:text-clash-300 leading-6 font-semibold"
					onclick={() => {
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
			<form class="space-y-6" method="POST" action="?/signUp" onsubmit={setLoadingState}>
				<div>
					<label for="email" class="block text-sm leading-6 font-medium text-white"
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
							class="focus:ring-clash-500 block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-white/10 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center">
						<label for="password" class="block text-sm leading-6 font-medium text-white"
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
							class="focus:ring-clash-500 block w-full rounded-md border-0 bg-white/5 py-1.5 pl-2 text-white shadow-sm ring-1 ring-white/10 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div>
					<button
						type="submit"
						disabled={loading}
						class="bg-clash-500 hover:bg-clash-400 focus-visible:outline-clash-500 flex w-full justify-center rounded-md px-3 py-1.5 text-sm leading-6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
						>{loading ? 'Signing up...' : 'Sign up'}</button
					>
				</div>
			</form>
			<p class="mt-10 text-center text-sm text-gray-400">
				Already a member?
				<button
					class="text-clash-400 hover:text-clash-300 leading-6 font-semibold"
					onclick={() => {
						showRegister = false;
						error = '';
					}}>Sign in</button
				>
			</p>
		</div>
	{/if}
</div>
