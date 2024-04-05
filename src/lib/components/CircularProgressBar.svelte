<script lang="ts">
	import { tweened } from 'svelte/motion';

	export let count: number;
	export let total: number;
	export let width = 100;
	export let strokeWidth = 10;
	export let textType: 'count' | 'percentage' = 'count';

	const progress = (count / total) * 100;
	const animationProgres = tweened(0, { duration: 500 });
	animationProgres.set(100);
	$: currentPercentage = ($animationProgres * progress) / 100;
	$: currentNum = ($animationProgres * count) / 100;

	const cx = width / 2;
	const cy = width / 2;
	const radius = (width - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	$: dashoffset = circumference - (circumference * currentPercentage) / 100;
</script>

<div class="relative size-20">
	<svg class="size-full" viewBox="0 0 100 100">
		<circle
			class="stroke-current text-gray-600"
			stroke-width={strokeWidth}
			{cx}
			{cy}
			r={radius}
			fill="transparent"
		></circle>
		<circle
			class="transition-color progress-ring__circle origin-center -rotate-90 transform stroke-current text-clash-400 duration-500"
			class:text-emerald-500={currentPercentage === 100}
			stroke-linecap="round"
			fill="transparent"
			stroke-width={strokeWidth}
			{cx}
			{cy}
			r={radius}
			stroke-dasharray={circumference}
			stroke-dashoffset={dashoffset}
		></circle>
		<text x="50" y="50" font-size="18" text-anchor="middle" fill="white" alignment-baseline="middle"
			>{#if textType === 'count'}
				{currentNum.toFixed(0)} / {total}
			{:else if textType === 'percentage'}
				{currentPercentage.toFixed(1)}%
			{/if}</text
		>
	</svg>
</div>
