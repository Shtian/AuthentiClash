<script lang="ts">
	import { onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	export let duration: number;
	const progress = tweened(0, {
		duration
	});

	progress.set(100);

	onDestroy(() => {
		progress.set(100);
	});
</script>

<div class="absolute bottom-0 left-0 right-0 h-1.5 w-full overflow-hidden rounded-b-sm">
	<div class="h-1.5 bg-clash-600" style={`width:${$progress}%`}></div>
</div>
