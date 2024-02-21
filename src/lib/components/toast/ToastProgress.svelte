<script lang="ts">
	import { tweened } from 'svelte/motion';
	export let duration: number;
	const progress = tweened(0, {
		duration
	});

	progress.set(100);
</script>

<div class="absolute bottom-0 w-full h-1.5 rounded-b-sm overflow-hidden right-0 left-0">
	<div class="bg-clash-600 h-1.5" style={`width:${$progress}%`}></div>
</div>
