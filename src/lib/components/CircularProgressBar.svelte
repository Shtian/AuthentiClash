<script lang="ts">
	import { tweened } from 'svelte/motion';

	interface Props {
		count: number;
		total: number;
		width?: number;
		strokeWidth?: number;
		textType?: 'count' | 'percentage';
	}

	const { count, total, width = 100, strokeWidth = 10, textType = 'count' }: Props = $props();

	const progress = (count / total) * 100;
	const animationProgres = tweened(0, { duration: 500 });
	animationProgres.set(100);
	const currentPercentage = $derived(($animationProgres * progress) / 100);
	const currentNum = $derived(($animationProgres * count) / 100);

	const cx = width / 2;
	const cy = width / 2;
	const radius = (width - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const dashoffset = $derived(circumference - (circumference * currentPercentage) / 100);
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
			class="transition-color progress-ring__circle text-clash-400 origin-center -rotate-90 transform stroke-current duration-500"
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
		<text
			class="fill-foreground"
			x="50"
			y="50"
			font-size="18"
			text-anchor="middle"
			fill="white"
			alignment-baseline="middle"
			>{#if textType === 'count'}
				{currentNum.toFixed(0)} / {total}
			{:else if textType === 'percentage'}
				{currentPercentage.toFixed(1)}%
			{/if}</text
		>
	</svg>
</div>
