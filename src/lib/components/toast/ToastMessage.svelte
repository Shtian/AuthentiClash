<script lang="ts">
	import { toast } from '$lib/stores/ToastStore';
	import { onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	interface Props {
		message?: string;
		duration: number;

		[key: string]: any;
	}

	const { message = '', duration, ...rest }: Props = $props();
	const progress = tweened(0, {
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
