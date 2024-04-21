<script lang="ts">
	import type { BadgeActivity } from '$lib/supabase/badges';

	export let data;
	const dateFormatter = Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	const badgeActivity: BadgeActivity[] = data.badgeActivity?.data || [];
</script>

<div class="mx-auto flow-root max-w-[1200px] px-6 lg:px-8 lg:py-10">
	<ul role="list" class="-mb-8">
		{#each badgeActivity as activity, index}
			<li>
				<div class="relative pb-8">
					{#if index !== badgeActivity.length - 1}<span
							class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-700"
							aria-hidden="true"
						></span>{/if}
					<div class="relative flex space-x-3">
						<div>
							<span
								class="flex h-8 w-8 items-center justify-center rounded-full bg-background ring-8 ring-[bg-background]"
							>
								<img src={activity.player.avatar_url} alt="Player avatar" />
							</span>
						</div>
						<div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
							<div>
								<p class="text-sm text-white">
									{activity.player.username} unlocked
									<img
										src={activity.badge.image}
										alt="badge"
										class="inline-block size-6 rounded-full"
									/>
									{activity.badge.name}
								</p>
							</div>
							<div class="whitespace-nowrap text-right text-sm text-gray-500">
								<time
									datetime={activity.awarded_on.toISOString()}
									title={activity.awarded_on.toISOString()}
									>{dateFormatter.format(activity.awarded_on)}</time
								>
							</div>
						</div>
					</div>
				</div>
			</li>
		{:else}
			<li>No badges unlocked!</li>
		{/each}
	</ul>
</div>
