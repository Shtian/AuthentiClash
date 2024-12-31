<script lang="ts">
	import { toast } from '$lib/stores/ToastStore';
	import { onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	interface Props {
		message?: string;
		duration: number;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}

	let { message = '', duration, ...rest }: Props = $props();
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

<p {...rest}>
	{message}
</p>
