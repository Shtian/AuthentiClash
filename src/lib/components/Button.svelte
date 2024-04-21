<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '$lib/utils';

	const buttonVariants = tv({
		base: 'inline-flex w-full whitespace-nowrap justify-center items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clash-500 transition-colors disabled:pointer-events-none disabled:opacity-50',
		variants: {
			variant: {
				default: 'bg-clash-500 text-white hover:bg-clash-400'
			},
			size: {
				default: 'h-9 px-4 py-2'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});
	type Variant = VariantProps<typeof buttonVariants>['variant'];
	type Size = VariantProps<typeof buttonVariants>['size'];

	let className = '';
	export { className as class };
	export let variant: Variant = 'default';
	let size: Size = 'default';
</script>

<div class="justy"></div>
<button type="button" class={cn(buttonVariants({ variant, size, className }))} {...$$restProps}>
	<slot />
</button>
