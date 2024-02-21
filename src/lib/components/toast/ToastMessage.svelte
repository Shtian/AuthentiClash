<script lang="ts">
	import { toast } from '$lib/stores/ToastStore';
	import { onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	export let message = '';
	export let duration: number;
	let progress = tweened(0, {
		duration
	});

	onMount(async () => {
		await progress.set(100);
		toast.remove();
	});

	onDestroy(() => {
		progress.set(100);
	});
</script>

<p {...$$restProps}>
	{message}
</p>
