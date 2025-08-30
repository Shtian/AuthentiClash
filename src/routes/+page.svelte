<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import logo from '$lib/assets/authenticlash_logo.svg';
	import {
		ArrowRightCircle,
		Users,
		Gamepad2,
		Trophy,
		Star,
		Play,
		CheckCircle
	} from 'lucide-svelte';

	let visible = $state(false);
	let featuresVisible = $state(false);
	let howItWorksVisible = $state(false);
	let reduceMotion = $state(false);

	let featuresSection: HTMLElement | null = null;
	let howItWorksSection: HTMLElement | null = null;

	onMount(() => {
		visible = true;
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// Intersection Observer for scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target === featuresSection) {
							featuresVisible = true;
						} else if (entry.target === howItWorksSection) {
							howItWorksVisible = true;
						}
					}
				});
			},
			// Trigger a bit later so the animation starts deeper in view
			{ threshold: 0.35, rootMargin: '0px 0px -15% 0px' }
		);

		if (featuresSection) observer.observe(featuresSection);
		if (howItWorksSection) observer.observe(howItWorksSection);

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>AuthentiClash — Create or Join a Week‑Long Clash</title>
	<meta
		name="description"
		content="Create or join a week‑long game, pick a class, enter a two‑digit code daily, and compete for the highest accumulated score. Badges, AI commentators, AI avatars, and a stats overview."
	/>
</svelte:head>

<!-- Hero Section -->
<section class=" flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
	{#if visible}
		<h1
			class="to-clash-600 bg-gradient-to-br from-purple-600 bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
			in:fly={{ y: -20, duration: reduceMotion ? 0 : 1200 }}
		>
			AuthentiClash
		</h1>
		<div
			in:fly={{
				y: -10,
				duration: reduceMotion ? 0 : 900,
				delay: reduceMotion ? 0 : 400,
				opacity: 0
			}}
		>
			<p class="text-muted-foreground mx-auto mt-6 max-w-3xl text-xl md:text-2xl">
				Join or create a week-long game. Pick a class, enter a daily two-digit code, and unleash
				your skill. Climb the leaderboard, earn badges, and enjoy AI avatars, commentators, and
				stats.
			</p>
			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/games"
					class="to-clash-600 hover:to-clash-500 focus-visible:outline-clash-500 inline-flex items-center gap-x-2 rounded-lg bg-gradient-to-br from-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-500 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2"
				>
					<Play class="h-5 w-5" />
					Start Your Adventure
				</a>
			</div>
		</div>

		<div
			in:scale={{
				start: 0,
				duration: reduceMotion ? 0 : 200,
				delay: reduceMotion ? 0 : 900,
				opacity: 0
			}}
		>
			<img
				class="mx-auto mt-16 h-80 w-auto brightness-[200%] invert dark:brightness-100 dark:invert-0"
				src={logo}
				alt="AuthentiClash logo"
			/>
		</div>
	{/if}
</section>

<!-- Features Section -->
<section
	bind:this={featuresSection}
	class="features-section dark:bg-muted/30 rounded-md px-4 py-20"
>
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-6 text-4xl font-bold md:text-5xl">Why Choose AuthentiClash?</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Week‑long, daily‑code competition with classes, skills, badges, AI features, and a stats
				overview.
			</p>
		</div>

		{#if featuresVisible}
			<div
				class="grid grid-cols-1 gap-4 md:auto-rows-[minmax(0,1fr)] md:grid-cols-6 md:grid-rows-2"
				in:fly={{ y: 20, duration: reduceMotion ? 0 : 800, delay: reduceMotion ? 0 : 200 }}
			>
				<!-- Multiplayer Adventures - Large card -->
				<div
					class="bg-background border-border rounded-xl border p-8 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-3 md:row-span-2"
				>
					<div
						class="to-clash-600 mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 text-white"
					>
						<Users class="h-8 w-8" />
					</div>
					<h3 class="mb-4 text-2xl font-semibold">Time‑Boxed Multiplayer</h3>
					<p class="text-muted-foreground text-lg leading-relaxed">
						Create or join a week‑long game and invite friends. Climb the leaderboard by building
						your accumulated score before time runs out. Review performance in the stats overview.
					</p>
				</div>

				<!-- Dynamic Gameplay - Medium card -->
				<div
					class="bg-background border-border rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-3"
				>
					<div
						class="to-clash-600 mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 text-white"
					>
						<Gamepad2 class="h-6 w-6" />
					</div>
					<h3 class="mb-3 text-xl font-semibold">Daily Code + Skills</h3>
					<p class="text-muted-foreground">
						Enter a two-digit 2FA code each day to grow your score. No one’s checking, it’s all on
						the honor system. Pick a class, time your once-per-game skill, and see if you can
						outsmart the rest.
					</p>
				</div>

				<!-- Achievement System - Small card -->
				<div
					class="bg-background border-border rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-2"
				>
					<div
						class="to-clash-600 mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 text-white"
					>
						<Trophy class="h-5 w-5" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">Badges & Leaderboards</h3>
					<p class="text-muted-foreground text-sm">
						Unlock badges and climb the leaderboard as your weekly score grows.
					</p>
				</div>

				<!-- Customizable Experience - Small card -->
				<div
					class="bg-background border-border rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-1"
				>
					<div
						class="to-clash-600 mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 text-white"
					>
						<Star class="h-5 w-5" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">AI Commentary & Avatars</h3>
					<p class="text-muted-foreground text-sm">
						Enjoy AI commentators and AI avatar generation for extra flavor.
					</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- How It Works Section -->
<section bind:this={howItWorksSection} class="how-it-works-section bg-background px-4 py-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-6 text-4xl font-bold md:text-5xl">How It Works</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Start in minutes—create or join a week‑long game and score daily
			</p>
		</div>

		{#if howItWorksVisible}
			<div
				class="grid gap-8 md:grid-cols-3"
				in:fly={{ y: 20, duration: reduceMotion ? 0 : 800, delay: reduceMotion ? 0 : 200 }}
			>
				<div class="space-y-8 text-center">
					<div
						class="to-clash-600 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 text-xl font-bold text-white"
					>
						1
					</div>
					<h3 class="mb-4 text-xl font-semibold">Create or Join</h3>
					<p class="text-muted-foreground">
						Create a time‑constrained (week‑long) game or join with a game code. Set your name and
						invite friends.
					</p>
				</div>

				<div class="space-y-8 text-center">
					<div
						class="to-clash-600 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 text-xl font-bold text-white"
					>
						2
					</div>
					<h3 class="text-xl font-semibold">Pick Class & Play Daily</h3>
					<p class="text-muted-foreground mb-6">
						Choose a class (Barbarian, Necromancer, Diceblade, Warden, Paladin, Thief). Enter a
						two‑digit code every day and time your once‑per‑game skill.
					</p>
				</div>

				<div class="space-y-8 text-center">
					<div
						class="to-clash-600 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 text-xl font-bold text-white"
					>
						3
					</div>
					<h3 class="text-xl font-semibold">Compete & Achieve</h3>
					<p class="text-muted-foreground mb-6">
						Highest accumulated score at week’s end wins. Unlock badges and review performance in
						the stats overview.
					</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section -->
<section class="to-clash-600 rounded-md bg-gradient-to-r from-purple-600 px-4 py-20">
	<div class="mx-auto max-w-4xl text-center">
		<h2
			class="text-background mb-6 text-4xl font-bold text-shadow-white/30 text-shadow-xs md:text-5xl"
		>
			Ready to Create or Join a Clash?
		</h2>
		<p class=" mx-auto mb-8 max-w-2xl text-xl">
			Pick a class, enter a two‑digit code daily, and compete for the highest weekly score.
		</p>
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<a
				href="/games/create"
				class="inline-flex items-center gap-x-2 rounded-lg border border-white/30 bg-white/15 px-8 py-4 text-lg font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
			>
				Start your adventure
				<ArrowRightCircle class="h-5 w-5" />
			</a>
		</div>
		<div class="mt-12 flex items-center justify-center gap-8">
			<div class="flex items-center gap-2">
				<CheckCircle class="h-5 w-5" />
				<span>Free to Play</span>
			</div>
			<div class="flex items-center gap-2">
				<CheckCircle class="h-5 w-5" />
				<span>No Downloads</span>
			</div>
			<div class="flex items-center gap-2">
				<CheckCircle class="h-5 w-5" />
				<span>Instant Start</span>
			</div>
		</div>
	</div>
</section>
