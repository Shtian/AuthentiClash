<script lang="ts">
	import { seenBadges } from '$lib/stores/SeenBadgesStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { UserBadge } from './+page.server';
	interface Props {
		badge: UserBadge;
	}

	const { badge }: Props = $props();

	// Only show custom image if its NOT a secret badge or if the secret badge is unlocked
	const showBadgeCustomImage =
		(badge.image && !badge.secret) || (badge.image && badge.unlocked && badge.secret);

	let showBadge = $state(false);

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
	class="flex flex-col gap-y-4 rounded-lg p-4 shadow-sm"
	onmouseover={() => markBadgeAsSeen()}
	onfocus={() => markBadgeAsSeen()}
>
	<div class="group relative flex gap-x-4">
		<div class=" inline-flex size-16 shrink-0 items-center rounded-full">
			{#if showBadgeCustomImage}
				<img
					class={badge.unlocked
						? 'rounded-full transition-transform group-hover:scale-110'
						: 'rounded-full opacity-50 grayscale'}
					class:image-glow={badge.unlocked && badge.globalUnlockPercentage <= 10}
					src={badge.image}
					alt={`An image for the badge "${badge.name}"`}
				/>
			{:else if badge.secret}
				<img
					class="rounded-full"
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
			<p class="text-muted-foreground text-xs text-pretty">
				{badge.secret && !badge.unlocked
					? 'Veiled in secrecy, this trophy beckons to be unveiled by the worthy.'
					: badge.description}
			</p>
		</div>
		{#if badge.isNew && showBadge}
			<span
				in:fade={{ duration: 150 }}
				out:fade={{ duration: 150 }}
				class="bg-clash-400 text-foreground absolute -top-2 -left-2 rounded px-2 py-1 text-xs"
				>NEW</span
			>
		{/if}
	</div>
	<footer class="flex justify-between">
		<p class="text-muted-foreground text-xs">
			{badge.globalUnlockPercentage.toFixed(1)}% global unlock rate
		</p>
		{#if badge.unlocked}
			<p
				class="text-muted-foreground text-xs"
				title={`Awarded to you on ${badge.awarded_on?.toDateString()}`}
			>
				<em>{badge.awarded_on?.toISOString().substring(0, 10)}</em>
			</p>
		{/if}
	</footer>
</li>

<style>
	@keyframes glow {
		0% {
			box-shadow: 0 0 12px 1px rgba(255, 215, 0, 0.4);
		}
		50% {
			box-shadow: 0 0 12px 4px rgba(255, 215, 0, 0.6);
		}
		100% {
			box-shadow: 0 0 12px 1px rgba(255, 215, 0, 0.4);
		}
	}

	.image-glow {
		animation: glow 3s infinite alternate ease-in-out;
	}
</style>
