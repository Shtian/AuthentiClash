<script lang="ts">
	import { tweened } from 'svelte/motion';
	interface Props {
		value: number;
		decimals?: number;
		duration?: number;
	}

	const { value, decimals = 0, duration = 300 }: Props = $props();
	const progress = tweened(0, { duration });
	progress.set(100);
	const currentNum = $derived(($progress * value) / 100);
</script>

<span class="tabular-nums">{currentNum.toFixed(decimals)}</span>
