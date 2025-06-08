<script lang="ts">
	interface Tab {
		name: string;
		url: string;
		isActive: boolean;
	}

	interface Props {
		tabs: Tab[];
	}

	const { tabs }: Props = $props();
</script>

<div class="tabs">
	<div class="sm:hidden">
		<label for="tabs" class="sr-only">Select a tab</label>
		<select
			id="tabs"
			name="tabs"
			class="text-foreground block w-full rounded-md border-none bg-white/5 py-2 pr-10 pl-3 text-base shadow-sm ring-1 ring-white/10 ring-inset focus:ring-2 focus:ring-indigo-500 focus:ring-inset sm:text-sm"
		>
			{#each tabs as { name, url, isActive } (name)}
				<option selected={isActive} value={url}>{name}</option>
			{/each}
		</select>
	</div>
	<div class="hidden sm:block">
		<nav class="flex border-b border-white/10 py-4">
			<ul
				role="list"
				class="text-foreground flex min-w-full flex-none gap-x-6 px-2 text-sm leading-6 font-semibold"
			>
				{#each tabs as { name, url, isActive } (name)}
					<a
						href={url}
						class={`transition-colors ${isActive ? 'text-clash-400' : 'hover:text-clash-400 dark:hover:text-clash-200'}`}
						data-sveltekit-preload-data="hover">{name}</a
					>
				{/each}
			</ul>
		</nav>
	</div>
</div>

<style>
	.tabs {
		view-transition-name: tabs;
	}
</style>
