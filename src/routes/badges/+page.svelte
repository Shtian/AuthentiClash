<script lang="ts">
	import type { PageServerData } from '../badges/$types';
	import UserBadge from './UserBadge.svelte';

	export let data: PageServerData;
	const badges = data.badges || [];
</script>

<div class="mx-auto max-w-[1200px] px-6 lg:px-8 lg:py-10">
	<div class="mx-auto mb-8 max-w-2xl lg:mx-0">
		<h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Badges</h1>
		<p class="mt-6 text-lg leading-8 text-white">
			View your hard earned badges, and see which ones you still need to unlock. Some badges are
			hidden until you unlock them!
		</p>
	</div>
	<ul class="space-y-4">
		{#each badges as badge}
			<UserBadge {badge} />
		{:else}
			<li>No badges enabled yet 🤡</li>
		{/each}
	</ul>
</div>
