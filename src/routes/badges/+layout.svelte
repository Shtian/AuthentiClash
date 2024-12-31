<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';
	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
	const tabs: { [key: string]: string } = {
		Overview: '/badges',
		Activity: '/badges/activity'
	} as const;

	type TabName = keyof typeof tabs;

	function tabSelected(e: Event) {
		const eventTarget: HTMLSelectElement = e.target as HTMLSelectElement;
		const tabname = eventTarget.value as TabName;
		if (!($page.url.pathname === tabs[tabname])) goto(tabs[tabname]);
	}
</script>

<div class="tabs px-4 py-6 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<div class="sm:hidden">
			<label for="tabs" class="sr-only">Select a tab</label>
			<select
				id="tabs"
				name="tabs"
				class="block w-full rounded-md border-none bg-white/5 py-2 pl-3 pr-10 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
				onchange={tabSelected}
			>
				{#each Object.entries(tabs) as [name]}
					<option selected={$page.url.pathname == tabs[name]} value={name}>{name}</option>
				{/each}
			</select>
		</div>
		<div class="hidden sm:block">
			<nav class="flex border-b border-white/10 py-4">
				<ul
					role="list"
					class="flex min-w-full flex-none gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-400"
				>
					{#each Object.entries(tabs) as [name, url]}
						<a
							href={url}
							class={`transition-colors ${$page.url.pathname === tabs[name] ? 'text-clash-200' : 'hover:text-white'}`}
							data-sveltekit-preload-data="hover">{name}</a
						>
					{/each}
				</ul>
			</nav>
		</div>
	</div>
</div>

{@render children?.()}

<style>
	.tabs {
		view-transition-name: tabs;
	}
</style>
