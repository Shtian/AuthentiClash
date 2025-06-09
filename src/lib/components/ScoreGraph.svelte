<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	interface Props {
		allScores?: number[];
		limit?: number;
		width?: number;
		height?: number;
		marginTop?: number;
		marginRight?: number;
		marginBottom?: number;
		marginLeft?: number;
	}

	const {
		allScores = [],
		limit = 50,
		width = 928,
		height = 500,
		marginTop = 20,
		marginRight = 30,
		marginBottom = 30,
		marginLeft = 40
	}: Props = $props();
	const scores: number[] = allScores.slice(limit * -1);

	let path: SVGPathElement | undefined = $state(undefined);
	let pathLength = 0;

	const xScale = d3.scaleLinear([1, scores.length], [marginLeft, width - marginRight]);
	const yScale = d3.scaleLinear([0, 100], [height - marginBottom, marginTop]);
	const line = d3
		.line<number>()
		.curve(d3.curveMonotoneX)
		.x((_, i) => xScale(i + 1))
		.y((d) => yScale(d));

	onMount(() => {
		if (path) {
			pathLength = path.getTotalLength();
			path.style.setProperty('--path-length', pathLength.toString());
			path.style.strokeDasharray = pathLength.toString();
			path.style.strokeDashoffset = pathLength.toString();
		}
	});
</script>

<svg {width} {height} viewBox="0 0 {width} {height}" style:max-width="100%" style:height="auto">
	<!-- X-Axis -->
	<g transform="translate(0,{height - marginBottom})">
		<line class="text-gray-600" stroke="currentColor" x1={marginLeft - 6} x2={width} />
	</g>

	<!-- Y-Axis and Grid Lines -->
	<g transform="translate({marginLeft},0)">
		{#each yScale.ticks(5) as tick (tick)}
			{#if tick !== 0}
				<line
					stroke="currentColor"
					stroke-opacity="0.1"
					x1={0}
					x2={width - marginLeft}
					y1={yScale(tick)}
					y2={yScale(tick)}
				/>
			{/if}
			<!-- Y-Axis Tick Labels -->
			<text
				class="text-sm text-gray-600"
				fill="currentColor"
				text-anchor="end"
				dominant-baseline="middle"
				x={-9}
				y={yScale(tick)}
			>
				{tick}
			</text>
		{/each}
	</g>
	{#each scores as score, i (i)}
		<g class="group outline-none">
			<rect
				x={xScale(i + 1) - 24}
				y={0}
				width={width / (scores.length + 1)}
				height="100%"
				fill="none"
				pointer-events="all"
			/>
			<circle
				class="transition-[r] duration-200 ease-in-out"
				cx={xScale(i + 1)}
				cy={yScale(score)}
				r={4}
				fill="#136195"
			/>
			<text
				class="text-muted-foreground cursor-default text-sm opacity-0 transition-opacity group-hover:opacity-100"
				fill="currentColor"
				text-anchor="middle"
				x={xScale(i + 1)}
				y={yScale(score) + 20}>{score}</text
			>
		</g>
	{/each}
	<path
		bind:this={path}
		class="path-score-line"
		fill="none"
		stroke="#136195"
		stroke-width="2.5"
		d={line(scores)}
	/>
</svg>

<style>
	.path-score-line {
		fill: transparent;
		stroke-linejoin: round;
		animation: draw 1s ease-out forwards;
	}

	@keyframes draw {
		from {
			stroke-dashoffset: var(--path-length);
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
