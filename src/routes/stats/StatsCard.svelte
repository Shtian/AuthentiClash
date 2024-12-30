<script lang="ts">
	import { CircleHelp } from 'lucide-svelte';
	import * as Popover from '$lib/components/ui/popover';

	interface Props {
		title: string;
		cols?: 'single' | 'half' | 'full';
		helptext?: string;
		children?: import('svelte').Snippet;
	}

	let { title, cols = 'half', helptext = '', children }: Props = $props();

	let colClass = $state('sm:col-span-6');
	switch (cols) {
		case 'half':
			colClass = 'sm:col-span-6';
			break;
		case 'full':
			colClass = 'sm:col-span-12';
			break;
		case 'single':
			colClass = 'sm:col-span-1';
			break;
	}
</script>

<div
	class={`col-span-12 ${colClass} flex flex-col gap-4 rounded-lg border-[1px] border-gray-700 p-6 shadow-sm`}
>
	<h2 class="flex place-content-between text-xl text-gray-300">
		<span>{title}</span>
		{#if helptext}
			<Popover.Root>
				<Popover.Trigger><CircleHelp class="size-6" /></Popover.Trigger>
				<Popover.Content>{helptext}</Popover.Content>
			</Popover.Root>
		{/if}
	</h2>
	{@render children?.()}
</div>
