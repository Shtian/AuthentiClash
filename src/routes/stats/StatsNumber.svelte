<script lang="ts">
	import { tweened } from 'svelte/motion';
	export let value: number;
	export let decimals = 0;
	export let duration = 300;
	const progress = tweened(0, { duration });
	progress.set(100);
	$: currentNum = ($progress * value) / 100;
</script>

<span class="tabular-nums">{currentNum.toFixed(decimals)}</span>
