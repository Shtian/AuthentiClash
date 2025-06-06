<script lang="ts">
	import { onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	interface Props {
		duration: number;
	}

	const { duration }: Props = $props();
	const progress = tweened(0, {
		duration
	});

	progress.set(100);

	onDestroy(() => {
		progress.set(100);
	});
</script>

<div class="absolute right-0 bottom-0 left-0 h-1.5 w-full overflow-hidden rounded-b-sm">
	<div class="bg-clash-600 h-1.5" style={`width:${$progress}%`}></div>
</div>
