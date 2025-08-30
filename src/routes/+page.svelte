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
			{ threshold: 0.1 }
		);

		featuresSection && observer.observe(featuresSection);
		howItWorksSection && observer.observe(howItWorksSection);

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
			class="to-clash-200 from-foreground bg-gradient-to-br bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
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
				Log in and create or join a time‑constrained, week‑long game. Pick a class and name, enter a
				two‑digit code each day, and use your once‑per‑game skill. Compete for the highest
				accumulated score. Includes badges, AI commentators, AI avatar generation, and a stats
				overview.
			</p>
			<div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/games"
					class="bg-clash-500 hover:bg-clash-400 focus-visible:outline-clash-500 text-background dark:text-foreground inline-flex items-center gap-x-2 rounded-lg px-6 py-3 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2"
				>
					<Play class="h-5 w-5" />
					Start Your Adventure
				</a>
				<a
					href="/games/create"
					class="border-clash-500 text-clash-500 hover:bg-clash-500 hover:text-background dark:hover:text-foreground inline-flex items-center gap-x-2 rounded-lg border px-6 py-3 text-lg font-semibold transition-all duration-200"
				>
					Create Game
					<ArrowRightCircle class="h-5 w-5" />
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
<section bind:this={featuresSection} class="features-section bg-muted/30 px-4 py-20">
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
					<div class="bg-clash-500/10 mb-6 flex h-16 w-16 items-center justify-center rounded-xl">
						<Users class="text-clash-500 h-8 w-8" />
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
					<div class="bg-clash-500/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
						<Gamepad2 class="text-clash-500 h-6 w-6" />
					</div>
					<h3 class="mb-3 text-xl font-semibold">Daily Code + Skills</h3>
					<p class="text-muted-foreground">
						Enter a two‑digit code every day to build your score. Choose a class and time your
						once‑per‑game skill—some classes also have a passive skill.
					</p>
				</div>

				<!-- Achievement System - Small card -->
				<div
					class="bg-background border-border rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-2"
				>
					<div class="bg-clash-500/10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
						<Trophy class="text-clash-500 h-5 w-5" />
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
					<div class="bg-clash-500/10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
						<Star class="text-clash-500 h-5 w-5" />
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
					<div class="bg-muted/50 flex h-48 items-center justify-center rounded-lg p-4">
						<div class="text-muted-foreground text-sm">Game Creation Interface</div>
					</div>
					<div
						class="bg-clash-500 text-background mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
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
					<div class="bg-muted/50 flex h-48 items-center justify-center rounded-lg p-4">
						<div class="text-muted-foreground text-sm">Gameplay Interface</div>
					</div>
					<div
						class="bg-clash-500 text-background mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
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
					<div class="bg-muted/50 flex h-48 items-center justify-center rounded-lg p-4">
						<div class="text-muted-foreground text-sm">Stats & Achievements</div>
					</div>
					<div
						class="bg-clash-500 text-background mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
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
<section class="from-clash-500 to-clash-600 bg-gradient-to-r px-4 py-20">
	<div class="mx-auto max-w-4xl text-center">
		<h2 class="text-background mb-6 text-4xl font-bold md:text-5xl">
			Ready to Create or Join a Clash?
		</h2>
		<p class="text-clash-100 mx-auto mb-8 max-w-2xl text-xl">
			Pick a class, enter a two‑digit code daily, and compete for the highest weekly score.
		</p>
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<a
				href="/games"
				class="bg-background text-clash-600 hover:bg-clash-50 inline-flex items-center gap-x-2 rounded-lg px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
			>
				<Play class="h-5 w-5" />
				Start Playing Now
			</a>
			<a
				href="/games/create"
				class="border-background text-background hover:bg-background hover:text-clash-600 inline-flex items-center gap-x-2 rounded-lg border-2 px-8 py-4 text-lg font-semibold transition-all duration-200"
			>
				Create Your Game
				<ArrowRightCircle class="h-5 w-5" />
			</a>
		</div>
		<div class="text-clash-100 mt-12 flex items-center justify-center gap-8">
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
