<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import logo from '$lib/assets/authenticlash_logo.svg';
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
		<p class="text-md md:text-lg mt-4" in:fly={{ y: -10, duration: 1500, delay: 700, opacity: 0 }}>
			Get Ready for the Most Average Adventure of Your Life!
		</p>
		<a
			in:fly={{ x: -10, duration: 300, delay: 2000, opacity: 0 }}
			href="/games"
			class="mt-8 inline-flex gap-x-2 items-center self-center rounded-md bg-clash-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clash-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500"
		>
			Play Now
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
		</a>
		<img 
		in:scale={{ start: 0, duration: 200, delay: 2000, opacity: 0 }} class="mx-auto h-80 w-auto mt-16" src={logo} alt="AuthentiClash logo" />
	{/if}
</heading>
