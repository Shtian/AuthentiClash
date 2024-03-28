<script lang="ts">
	export let title: string;
	export let cols: 'single' | 'half' | 'full' = 'half';

	let colClass = 'sm:col-span-6';
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
	<h2 class="text-xl text-gray-300">{title}</h2>
	<slot />
</div>
