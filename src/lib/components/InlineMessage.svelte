<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		msgType?: 'success' | 'error';
		children?: Snippet;
	}

	const { msgType = 'success', children }: Props = $props();
</script>

{#if msgType === 'error'}
	<div
		in:fade
		class="sm-w-full mt-10 flex items-center gap-x-2 rounded-md px-4 py-2 ring-1 ring-red-300 sm:mx-auto sm:max-w-sm"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-8 w-8"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
			/>
		</svg>
		{@render children?.()}
	</div>
{:else if msgType === 'success'}
	<div
		in:fade
		class="sm-w-full mt-10 flex items-center gap-x-2 rounded-md px-4 py-2 ring-1 ring-green-300 sm:mx-auto sm:max-w-sm"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-8 w-8"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
			/>
		</svg>
		{@render children?.()}
	</div>
{/if}
