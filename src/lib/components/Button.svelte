<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	const buttonVariants = tv({
		base: 'inline-flex whitespace-nowrap justify-center items-center rounded-md text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500 transition-colors disabled:pointer-events-none disabled:opacity-50',
		variants: {
			variant: {
				default: 'bg-clash-500 text-background dark:text-foreground hover:bg-clash-400'
			},
			size: {
				default: 'h-9 px-4 py-2',
				large: 'h-16 px-12 text-base'
			},
			fullWidth: {
				true: 'w-full'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			fullWidth: false
		}
	});
	type Variant = VariantProps<typeof buttonVariants>['variant'];
	type Size = VariantProps<typeof buttonVariants>['size'];

	interface Props {
		class?: string;
		variant?: Variant;
		size?: Size;
		fullWidth?: boolean;
		children?: Snippet;

		[key: string]: any;
	}

	const {
		class: className = '',
		size = 'default',
		variant = 'default',
		fullWidth = false,
		children,
		...others
	}: Props = $props();
</script>

<button
	type="button"
	class={cn(buttonVariants({ variant, size, fullWidth, className }))}
	{...others}
>
	{@render children?.()}
</button>
