<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale, fade } from 'svelte/transition';
	import logo from '$lib/assets/authenticlash_logo.svg';
	import {
		ArrowRightCircle,
		Users,
		Gamepad2,
		Trophy,
		Zap,
		Shield,
		Star,
		Play,
		CheckCircle,
		Quote
	} from 'lucide-svelte';

	let visible = $state(false);
	let featuresVisible = $state(false);
	let howItWorksVisible = $state(false);
	let testimonialsVisible = $state(false);

	onMount(() => {
		visible = true;

		// Intersection Observer for scroll animations
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target.classList.contains('features-section')) {
							featuresVisible = true;
						} else if (entry.target.classList.contains('how-it-works-section')) {
							howItWorksVisible = true;
						} else if (entry.target.classList.contains('testimonials-section')) {
							testimonialsVisible = true;
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Observe sections
		document
			.querySelectorAll('.features-section, .how-it-works-section, .testimonials-section')
			.forEach((el) => {
				observer.observe(el);
			});
	});
</script>

<!-- Hero Section -->
<section
	class="from-background via-background to-muted/20 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br px-4 py-20 text-center"
>
	{#if visible}
		<h1
			class="to-clash-200 from-foreground bg-linear-to-br bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
			in:fly={{ y: -20, duration: 2000 }}
		>
			AuthentiClash
		</h1>
		<div in:fly={{ y: -10, duration: 1500, delay: 700, opacity: 0 }}>
			<p class="text-muted-foreground mx-auto mt-6 max-w-3xl text-xl md:text-2xl">
				The Most Average Adventure of Your Life - Where Mediocrity Meets Magic in an Epic Text-Based
				RPG Experience
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

		<div in:scale={{ start: 0, duration: 200, delay: 1500, opacity: 0 }}>
			<img
				class="mx-auto mt-16 h-80 w-auto brightness-[200%] invert dark:brightness-100 dark:invert-0"
				src={logo}
				alt="AuthentiClash logo"
			/>
		</div>
	{/if}
</section>

<!-- Features Section -->
<section class="features-section bg-muted/30 px-4 py-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-6 text-4xl font-bold md:text-5xl">Why Choose AuthentiClash?</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Experience the perfect blend of humor, strategy, and unpredictability in our unique
				text-based RPG
			</p>
		</div>

		{#if featuresVisible}
			<div
				class="grid h-[600px] grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2"
				in:fly={{ y: 20, duration: 800, delay: 200 }}
			>
				<!-- Multiplayer Adventures - Large card -->
				<div
					class="bg-background border-border rounded-xl border p-8 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-3 md:row-span-2"
				>
					<div class="bg-clash-500/10 mb-6 flex h-16 w-16 items-center justify-center rounded-xl">
						<Users class="text-clash-500 h-8 w-8" />
					</div>
					<h3 class="mb-4 text-2xl font-semibold">Multiplayer Adventures</h3>
					<p class="text-muted-foreground text-lg leading-relaxed">
						Join friends in epic battles where every decision matters. Create private games and
						invite your friends to join the fun. Experience the thrill of cooperative and
						competitive gameplay in a unique text-based RPG environment.
					</p>
				</div>

				<!-- Dynamic Gameplay - Medium card -->
				<div
					class="bg-background border-border rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-3"
				>
					<div class="bg-clash-500/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
						<Gamepad2 class="text-clash-500 h-6 w-6" />
					</div>
					<h3 class="mb-3 text-xl font-semibold">Dynamic Gameplay</h3>
					<p class="text-muted-foreground">
						Every game is unique with procedurally generated events, AI-powered commentary, and
						unpredictable outcomes that keep you on your toes.
					</p>
				</div>

				<!-- Achievement System - Small card -->
				<div
					class="bg-background border-border rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-2"
				>
					<div class="bg-clash-500/10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
						<Trophy class="text-clash-500 h-5 w-5" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">Achievement System</h3>
					<p class="text-muted-foreground text-sm">
						Unlock badges, track progress, and compete on leaderboards.
					</p>
				</div>

				<!-- Customizable Experience - Small card -->
				<div
					class="bg-background border-border rounded-xl border p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:col-span-1"
				>
					<div class="bg-clash-500/10 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
						<Star class="text-clash-500 h-5 w-5" />
					</div>
					<h3 class="mb-2 text-lg font-semibold">Customizable</h3>
					<p class="text-muted-foreground text-sm">
						Create games with custom backgrounds and personalities.
					</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- How It Works Section -->
<section class="how-it-works-section bg-background px-4 py-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-6 text-4xl font-bold md:text-5xl">How It Works</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Get started in minutes with our simple three-step process
			</p>
		</div>

		{#if howItWorksVisible}
			<div class="grid gap-8 md:grid-cols-3" in:fly={{ y: 20, duration: 800, delay: 200 }}>
				<div class="text-center">
					<div
						class="bg-clash-500 text-background mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
					>
						1
					</div>
					<h3 class="mb-4 text-xl font-semibold">Create or Join</h3>
					<p class="text-muted-foreground mb-6">
						Start a new game with custom settings or join an existing one with a simple game code.
					</p>
					<div class="bg-muted/50 flex h-48 items-center justify-center rounded-lg p-4">
						<div class="text-muted-foreground text-sm">Game Creation Interface</div>
					</div>
				</div>

				<div class="text-center">
					<div
						class="bg-clash-500 text-background mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
					>
						2
					</div>
					<h3 class="mb-4 text-xl font-semibold">Play & Strategize</h3>
					<p class="text-muted-foreground mb-6">
						Make tactical decisions, use abilities, and watch as AI commentators narrate your
						adventure.
					</p>
					<div class="bg-muted/50 flex h-48 items-center justify-center rounded-lg p-4">
						<div class="text-muted-foreground text-sm">Gameplay Interface</div>
					</div>
				</div>

				<div class="text-center">
					<div
						class="bg-clash-500 text-background mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
					>
						3
					</div>
					<h3 class="mb-4 text-xl font-semibold">Compete & Achieve</h3>
					<p class="text-muted-foreground mb-6">
						Track your progress, unlock badges, and climb the leaderboards with every victory.
					</p>
					<div class="bg-muted/50 flex h-48 items-center justify-center rounded-lg p-4">
						<div class="text-muted-foreground text-sm">Stats & Achievements</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Testimonials Section -->
<section class="testimonials-section bg-muted/30 px-4 py-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-6 text-4xl font-bold md:text-5xl">What Players Say</h2>
			<p class="text-muted-foreground mx-auto max-w-3xl text-xl">
				Join thousands of players who've discovered the joy of average adventures
			</p>
		</div>

		{#if testimonialsVisible}
			<div
				class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
				in:fly={{ y: 20, duration: 800, delay: 200 }}
			>
				<div class="bg-background border-border rounded-xl border p-8 shadow-lg">
					<div class="mb-4 flex items-center">
						<div
							class="bg-clash-500/20 mr-4 flex h-12 w-12 items-center justify-center rounded-full"
						>
							<span class="text-clash-500 font-semibold">S</span>
						</div>
						<div>
							<h4 class="font-semibold">Sarah Chen</h4>
							<div class="flex text-yellow-400">
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
							</div>
						</div>
					</div>
					<Quote class="text-clash-500 mb-4 h-6 w-6" />
					<p class="text-muted-foreground italic">
						"AuthentiClash is the perfect blend of strategy and humor. The AI commentary had us
						laughing for hours!"
					</p>
				</div>

				<div class="bg-background border-border rounded-xl border p-8 shadow-lg">
					<div class="mb-4 flex items-center">
						<div
							class="bg-clash-500/20 mr-4 flex h-12 w-12 items-center justify-center rounded-full"
						>
							<span class="text-clash-500 font-semibold">M</span>
						</div>
						<div>
							<h4 class="font-semibold">Mike Rodriguez</h4>
							<div class="flex text-yellow-400">
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
							</div>
						</div>
					</div>
					<Quote class="text-clash-500 mb-4 h-6 w-6" />
					<p class="text-muted-foreground italic">
						"Finally, a game that celebrates being average! The badge system keeps me coming back
						for more."
					</p>
				</div>

				<div class="bg-background border-border rounded-xl border p-8 shadow-lg">
					<div class="mb-4 flex items-center">
						<div
							class="bg-clash-500/20 mr-4 flex h-12 w-12 items-center justify-center rounded-full"
						>
							<span class="text-clash-500 font-semibold">A</span>
						</div>
						<div>
							<h4 class="font-semibold">Alex Thompson</h4>
							<div class="flex text-yellow-400">
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
								<Star class="h-4 w-4 fill-current" />
							</div>
						</div>
					</div>
					<Quote class="text-clash-500 mb-4 h-6 w-6" />
					<p class="text-muted-foreground italic">
						"The multiplayer experience is seamless. We've been playing weekly game nights for
						months!"
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
			Ready for Your Average Adventure?
		</h2>
		<p class="text-clash-100 mx-auto mb-8 max-w-2xl text-xl">
			Join thousands of players in the most delightfully mediocre RPG experience ever created
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
