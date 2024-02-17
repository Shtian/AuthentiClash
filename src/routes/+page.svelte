<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import logo from '$lib/assets/authenticlash_logo.svg';
	import { ArrowRightCircle } from 'lucide-svelte';
	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<heading class="mx-auto text-center flex flex-col justify-center">
	{#if visible}
		<h1
			class="text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-white to-clash-200"
			in:fly={{ y: -20, duration: 2000 }}
		>
			AuthentiClash
		</h1>
		<div in:fly={{ y: -10, duration: 1500, delay: 700, opacity: 0 }}>
			<p class="text-md md:text-lg mt-4">Get Ready for the Most Average Adventure of Your Life!</p>
			<a
				href="/games"
				class="mt-8 inline-flex gap-x-2 items-center self-center rounded-md bg-clash-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
			>
				Play Now
				<ArrowRightCircle class="w-6 h-6" />
			</a>
		</div>

		<div in:scale={{ start: 0, duration: 200, delay: 1500, opacity: 0 }}>
			<img class="mx-auto h-80 w-auto mt-16" src={logo} alt="AuthentiClash logo" />
		</div>
	{/if}
</heading>
