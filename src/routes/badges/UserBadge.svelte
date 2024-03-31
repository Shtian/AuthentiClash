<script lang="ts">
	import type { UserBadge } from './+page.server';
	export let badge: UserBadge;

	// Only show custom image if its NOT a secret badge or if the secret badge is unlocked
	const showBadgeCustomImage =
		(badge.image && !badge.secret) || (badge.image && badge.unlocked && badge.secret);
</script>

<li class="group relative flex gap-x-4 rounded-lg border-[1px] p-4">
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
		<p class="text-xs text-gray-300">
			{badge.secret && !badge.unlocked
				? 'Veiled in secrecy, this trophy beckons to be unveiled by the worthy.'
				: badge.description}
		</p>
		{#if badge.unlocked}
			<p class="absolute right-4 top-4 text-xs text-gray-300">
				<em>{badge.awarded_on?.toISOString().substring(0, 10)}</em>
			</p>
		{/if}
	</div>
	{#if badge.isNew}
		<span class="absolute -left-2 -top-2 rounded bg-clash-400 px-2 py-1 text-xs text-white"
			>NEW</span
		>
	{/if}
</li>
