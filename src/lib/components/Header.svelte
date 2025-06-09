<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import type { Session } from '@supabase/supabase-js';
	import { clickOutside } from '$lib/utils/clickOutside';
	import logo from '$lib/assets/authenticlash_logo.svg';
	import ThemeToggle from './ThemeToggle.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	interface Props {
		session?: Session | null;
	}

	const { session = null }: Props = $props();

	const links = [
		{ name: 'Games', href: '/games' },
		{ name: 'Gallery', href: '/gallery' },
		{ name: 'Stats', href: '/stats' },
		{ name: 'Badges', href: '/badges' }
	];

	let isMainMenuOpen = $state(false);
	const isLoggedIn = !!session?.user;

	async function sha256(message: string) {
		const msgBuffer = new TextEncoder().encode(message.trim().toLocaleLowerCase());

		const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

		const hashArray = Array.from(new Uint8Array(hashBuffer));

		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}
</script>

<header>
	<nav class="border-foreground/10 border-b shadow-sm">
		<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
			<div class="relative flex h-16 items-center justify-between">
				<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
					<!-- Mobile menu button-->
					<button
						type="button"
						class="hover:text-foreground text-muted-foreground relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-700 focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
						aria-controls="mobile-menu"
						aria-expanded="false"
						onclick={(e) => {
							isMainMenuOpen = !isMainMenuOpen;
							e.stopPropagation();
						}}
					>
						<span class="absolute -inset-0.5"></span>
						<span class="sr-only">Open main menu</span>

						{#if isMainMenuOpen}
							<svg
								class="block h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{:else}
							<svg
								class="block h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
						{/if}
					</button>
				</div>
				<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
					<a href="/" class="flex shrink-0 items-center">
						<img class="h-8 w-auto invert dark:invert-0" src={logo} alt="AuthentiClash logo" />
					</a>
					<div class="hidden sm:ml-6 sm:block">
						{#if isLoggedIn}
							<div class="flex space-x-4">
								{#each links as link (link.href)}
									{#if $page.url.pathname.includes(link.href)}
										<a
											href={link.href}
											class="text-foreground dark:text-foreground rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium dark:bg-zinc-700"
											aria-current="page">{link.name}</a
										>
									{:else}
										<a
											href={link.href}
											class="hover:text-foreground dark:hover:text-foreground dark:text-muted-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-gray-700"
											>{link.name}</a
										>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				</div>
				<div
					class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
				>
					<!-- Profile dropdown -->
					<ThemeToggle />
					<div class="relative ml-3">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								class="relative flex rounded-full text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
							>
								<span class="absolute -inset-1.5"></span>
								<span class="sr-only">Open user menu</span>
								<div class="relative h-8 w-8">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="text-muted-foreground absolute inset-0 h-8 w-8"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									{#if session?.user?.email}
										{#await sha256(session?.user?.email) then hash}
											<img
												in:fade={{ duration: 300, easing: quintOut }}
												class="absolute top-0 left-0 h-8 w-8 rounded-full"
												width="32"
												height="32"
												src={`https://gravatar.com/avatar/${hash}`}
												alt=""
											/>
										{/await}
									{/if}
								</div>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								{#if isLoggedIn}
									<DropdownMenu.Item>
										<a href="/account" class="w-full">Account</a>
									</DropdownMenu.Item>
									<DropdownMenu.Item>
										<a data-sveltekit-reload href="/auth/logout" class="w-full">Sign out</a>
									</DropdownMenu.Item>
								{:else}
									<DropdownMenu.Item>
										<a href="/auth/login" class="w-full">Login</a>
									</DropdownMenu.Item>
								{/if}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
		{#if isMainMenuOpen}
			<div
				transition:slide={{ duration: 300, easing: quintOut, axis: 'y' }}
				class="sm:hidden"
				id="mobile-menu"
				use:clickOutside={() => {
					isMainMenuOpen = false;
				}}
			>
				<div class="space-y-1 px-2 pt-2 pb-3">
					{#if isLoggedIn}
						<div class="flex space-x-4">
							{#each links as link (link.href)}
								{#if $page.url.pathname.includes(link.href)}
									<a
										href={link.href}
										class="text-foreground dark:text-foreground rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium dark:bg-zinc-700"
										aria-current="page">{link.name}</a
									>
								{:else}
									<a
										href={link.href}
										class="hover:text-foreground dark:hover:text-foreground dark:text-muted-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-gray-700"
										>{link.name}</a
									>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</nav>
</header>

<style>
	header {
		view-transition-name: header;
	}
</style>
