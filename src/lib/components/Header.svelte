<script lang="ts">
	import { page } from '$app/stores';
	const links = [
		{ name: 'Home', href: '/' },
		{ name: 'About', href: '/about' },
		{ name: 'Contact', href: '/contact' }
	];
</script>

<header class="bg-white">
	<nav
		class="mx-auto flex flex-row items-center gap-x-8 justify-between p-6 lg:px-8 max-w-7xl"
		aria-label="Global"
	>
		<a href="/"><img src="https://placehold.co/64" alt="logo" /></a>
		<div class="flex gap-x-12">
			{#each links as link}
				<a
					href={link.href}
					class="text-base font-medium text-gray-500 hover:text-gray-900"
					class:active={$page.url.pathname.includes(link.href)}
				>
					{link.name}
				</a>
			{/each}
		</div>
		<button>Sign In</button>
	</nav>
</header>

<style lang="postcss">
	.active {
		box-shadow: inset 0 -2px 0 0 #1aa42e;
		cursor: default;
		color: #000;
	}
</style>
