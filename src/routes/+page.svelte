<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	let visible = false;
	onMount(() => {
		visible = true;
	});
</script>

<heading class="mx-auto text-center flex flex-col justify-center">
	{#if visible}
		<h1
			class="text-7xl bg-clip-text text-transparent bg-gradient-to-br from-white to-violet-300"
			in:fly={{ y: -20, duration: 2000 }}
		>
			AuthentiClash
		</h1>
		<p class="text-lg mt-4" in:fly={{ y: -10, duration: 1500, delay: 700, opacity: 0 }}>
			Get Ready for the Most Average Adventure of Your Life!
		</p>
		<a
			in:fly={{ x: -10, duration: 300, delay: 2000, opacity: 0 }}
			href="/games"
			class="self-center mt-6 inline-flex items-center gap-x-3 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700"
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
	{/if}
</heading>
