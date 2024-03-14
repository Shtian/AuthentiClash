<script lang="ts">
	import * as d3 from 'd3';

	export let scores: Array<number> = [];

	export let width = 928;
	export let height = 500;
	export let marginTop = 20;
	export let marginRight = 30;
	export let marginBottom = 30;
	export let marginLeft = 40;

	const xScale = d3.scaleLinear([1, scores.length], [marginLeft, width - marginRight]);

	const yScale = d3.scaleLinear([0, 100], [height - marginBottom, marginTop]);

	const line = d3
		.line()
		.curve(d3.curveMonotoneX)
		.x((_, i) => xScale(i + 1))
		.y((d) => {
			return yScale(d as unknown as d3.NumberValue);
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
				class="text-gray-600 text-sm"
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
				class="text-gray-400 text-sm cursor-default transition-opacity opacity-0 group-hover:opacity-100"
				fill="currentColor"
				text-anchor="middle"
				x={xScale(i + 1)}
				y={yScale(score) + 20}>{score}</text
			>
		</g>
	{/each}
	<path fill="none" stroke="#136195" stroke-width="2.5" d={line(scores)} />
</svg>

<style>
	path {
		fill: transparent;
		stroke-linejoin: round;
		stroke-dasharray: 4400;
		stroke-dashoffset: 0;
		animation: draw 8.5s ease-out;
	}
	@keyframes draw {
		from {
			stroke-dashoffset: 4400;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
