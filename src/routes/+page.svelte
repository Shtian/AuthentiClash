<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import logo from '$lib/assets/authenticlash_logo.svg';
	import { ArrowRightCircle } from 'lucide-svelte';
	import AbilityAnnouncement from '$lib/components/AbilityAnnouncement.svelte';
	let visible = $state(false);
	onMount(() => {
		visible = true;
	});
</script>

<heading class="mx-auto flex flex-col justify-center text-center">
	{#if visible}
		<h1
			class="bg-gradient-to-br from-white to-clash-200 bg-clip-text text-5xl text-transparent md:text-7xl"
			in:fly={{ y: -20, duration: 2000 }}
		>
			AuthentiClash
		</h1>
		<div in:fly={{ y: -10, duration: 1500, delay: 700, opacity: 0 }}>
			<p class="text-md mt-4 md:text-lg">Get Ready for the Most Average Adventure of Your Life!</p>
			<a
				href="/games"
				class="mt-8 inline-flex items-center gap-x-2 self-center rounded-md bg-clash-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
			>
				Play Now
				<ArrowRightCircle class="h-6 w-6" />
			</a>
		</div>

		<div in:scale={{ start: 0, duration: 200, delay: 1500, opacity: 0 }}>
			<img class="mx-auto mt-16 h-80 w-auto" src={logo} alt="AuthentiClash logo" />
		</div>
		<div class="mt-8 text-left" in:fly={{ y: 10, duration: 1500, delay: 1700, opacity: 0 }}>
			<AbilityAnnouncement />
		</div>
	{/if}
</heading>
