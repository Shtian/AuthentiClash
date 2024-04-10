<script lang="ts">
	import type { UserBadge } from './+page.server';
	import { seenBadges } from '$lib/stores/SeenBadgesStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	export let badge: UserBadge;

	// Only show custom image if its NOT a secret badge or if the secret badge is unlocked
	const showBadgeCustomImage =
		(badge.image && !badge.secret) || (badge.image && badge.unlocked && badge.secret);

	$: showBadge = false;

	onMount(() => {
		showBadge = !$seenBadges.includes(badge.slug);
	});

	function markBadgeAsSeen() {
		if (!badge.unlocked) return;
		seenBadges.update((badges) => {
			if (!badges.includes(badge.slug)) {
				showBadge = false;
				return [...badges, badge.slug];
			}
			return badges;
		});
	}
</script>

<li
	class="flex flex-col gap-y-4 rounded-lg border-[1px] p-4"
	on:mouseover={() => markBadgeAsSeen()}
	on:focus={() => markBadgeAsSeen()}
>
	<div class="group relative flex gap-x-4">
		<div class=" inline-flex size-16 flex-shrink-0 items-center overflow-hidden rounded-full">
			{#if showBadgeCustomImage}
				<img
					class={badge.unlocked
						? 'transition-transform group-hover:scale-125'
						: 'opacity-50 grayscale'}
					src={badge.image}
					alt={`A image for the badge "${badge.name}"`}
				/>
			{:else if badge.secret}
				<img
					class="transition-transform group-hover:scale-150"
					src="https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/secret-trophy.webp"
					alt="Questionmark ensrouded in fog"
				/>
			{:else}
				<img
					class={badge.unlocked ? '' : 'opacity-50 grayscale'}
					src={`https://api.dicebear.com/8.x/shapes/svg?seed=${encodeURIComponent(badge.name)}`}
					alt={`An image for the badge "${badge.name}"`}
				/>
			{/if}
		</div>
		<div>
			<h2 class="text-balance sm:text-lg md:text-xl">
				{#if badge.unlocked}
					{badge.secret ? badge.name + ' (secret)' : badge.name}
				{:else if badge.secret}
					Secret badge
				{:else}
					{badge.name}
				{/if}
			</h2>
			<p class="text-pretty text-xs text-gray-300">
				{badge.secret && !badge.unlocked
					? 'Veiled in secrecy, this trophy beckons to be unveiled by the worthy.'
					: badge.description}
			</p>
		</div>
		{#if badge.isNew && showBadge}
			<span
				in:fade={{ duration: 150 }}
				out:fade={{ duration: 150 }}
				class="absolute -left-2 -top-2 rounded bg-clash-400 px-2 py-1 text-xs text-white">NEW</span
			>
		{/if}
	</div>
	<footer class="flex justify-between">
		<p class="text-xs text-gray-300">
			{badge.globalUnlockPercentage.toFixed(1)}% global unlock rate
		</p>
		{#if badge.unlocked}
			<p class="text-xs text-gray-300">
				<em>{badge.awarded_on?.toISOString().substring(0, 10)}</em>
			</p>
		{/if}
	</footer>
</li>
