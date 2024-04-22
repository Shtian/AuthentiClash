<script lang="ts">
	import { page } from '$app/stores';

	export let data;
	let pageSize = 10;

	$: badgeActivity = data.badgeActivity || [];
	$: totalItems = data.totalEntries || 0;
	$: totalPages = Math.ceil(totalItems / pageSize);
	$: currentPage = (Number($page.url.searchParams.get('skip')) || 0) / pageSize;
	$: startIndex = currentPage * pageSize + 1;
	$: endIndex = Math.min(startIndex + pageSize - 1, totalItems);

	const dateFormatter = Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: false
	});
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
								class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-background ring-8 ring-[hsl(var(--background))]"
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
	<nav
		class="mt-8 flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6"
		aria-label="Pagination"
	>
		<div class="hidden sm:block">
			<p class="text-sm text-white">
				Showing
				<span class="font-medium">{startIndex}</span>
				to
				<span class="font-medium">{endIndex}</span>
				of
				<span class="font-medium">{totalItems}</span>
				results
			</p>
		</div>
		<div class="flex flex-1 justify-between sm:justify-end">
			<a
				class:pointer-events-none={currentPage === 0}
				href="/badges/activity?limit={pageSize}&skip={Math.max((currentPage - 1) * pageSize, 0)}"
				class="none relative inline-flex items-center rounded-md bg-clash-500 px-3 py-2 text-sm font-semibold text-white hover:bg-clash-400 focus-visible:outline-offset-0"
				>Previous</a
			>
			<a
				class:pointer-events-none={currentPage === totalPages - 1}
				href="/badges/activity?limit={pageSize}&skip={(currentPage + 1) * pageSize}"
				class="relative ml-3 inline-flex items-center rounded-md bg-clash-500 px-3 py-2 text-sm font-semibold text-white hover:bg-clash-400 focus-visible:outline-offset-0"
				>Next</a
			>
		</div>
	</nav>
</div>

<style>
	[aria-label='Pagination'] {
		view-transition-name: pagination;
	}
</style>
