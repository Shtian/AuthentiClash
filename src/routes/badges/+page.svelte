<script lang="ts">
	import type { PageServerData } from '../badges/$types';
	import UserBadge from './UserBadge.svelte';
	import CircularProgressBar from '$lib/components/CircularProgressBar.svelte';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();
	const badges = data.badges || [];
</script>

<div class="mx-auto max-w-[1200px] px-6 lg:px-8 lg:py-10">
	<div class="mx-auto mb-8 max-w-2xl lg:mx-0">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Badge progress</h1>
			<CircularProgressBar total={badges.length} count={badges.filter((b) => b.unlocked).length} />
		</div>
		<p class="mt-6 text-lg leading-8 text-white">
			View your hard earned badges, and see which ones you still need to unlock. Some badges are
			hidden until you unlock them!
		</p>
		<p class="mt-6 text-lg leading-8 text-white">
			You earn progress towards badges by competing against other players. Most badges require a
			game with more than one participant.
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
