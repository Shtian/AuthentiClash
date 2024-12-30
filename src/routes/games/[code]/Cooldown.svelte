<script lang="ts">
	import { formatTimeDeltaShort } from '$lib/utils/dateUtils';
	import { onDestroy } from 'svelte';

	interface Props {
		delta: number;
	}

	let { delta = $bindable() }: Props = $props();
	const cooldownFinished = delta + new Date().getTime();
	let timeLeftString = $state(delta <= 0 ? '00:00:00' : formatTimeDeltaShort(delta));

	const timer = setInterval(() => {
		delta = cooldownFinished - new Date().getTime();
		if (delta <= 0) {
			clearInterval(timer);
			timeLeftString = '00:00:00';
		} else {
			timeLeftString = formatTimeDeltaShort(cooldownFinished - new Date().getTime());
		}
	}, 1000);

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<span class="tabular-nums">{timeLeftString}</span>
