<script lang="ts">
	import type { PageServerData } from '../badges/$types';

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
			<li class="group relative flex gap-x-4 rounded-lg border-[1px] p-4">
				<div class=" inline-flex size-16 flex-shrink-0 items-center overflow-hidden rounded-full">
					{#if badge.image && !badge.secret}
						<img
							class={badge.unlocked ? '' : 'opacity-50 grayscale'}
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
						{badge.secret && !badge.unlocked ? 'Secret badge' : badge.name}
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
		{:else}
			<li>No badges enabled yet 🤡</li>
		{/each}
	</ul>
</div>
