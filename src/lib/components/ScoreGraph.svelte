<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	export let allScores: Array<number> = [];
	export let limit = 50;
	export let width = 928;
	export let height = 500;
	export let marginTop = 20;
	export let marginRight = 30;
	export let marginBottom = 30;
	export let marginLeft = 40;
	let scores: Array<number> = allScores.slice(limit * -1);

	let path: SVGPathElement;
	let pathLength = 0;

	const xScale = d3.scaleLinear([1, scores.length], [marginLeft, width - marginRight]);
	const yScale = d3.scaleLinear([0, 100], [height - marginBottom, marginTop]);
	const line = d3
		.line()
		.curve(d3.curveMonotoneX)
		.x((_, i) => xScale(i + 1))
		.y((d) => {
			return yScale(d as unknown as d3.NumberValue);
		});

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
		{#each yScale.ticks(2) as tick}
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
	{#each scores as score, i}
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
				class="cursor-default text-sm text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
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
