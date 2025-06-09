<script lang="ts">
	import type { GameLog } from '$lib/supabase/gameLog';

	interface Props {
		logs?: GameLog[];
	}

	const { logs = [] }: Props = $props();

	const dateFormatter = Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: false
	});
</script>

<div>
	<h2 class="mt-6 mb-4 text-center text-2xl font-bold">📣 Events</h2>
	<ul role="list" class="space-y-6">
		{#each logs as log, index (log.id)}
			<li class="relative flex gap-x-4">
				{#if index !== logs.length - 1}
					<div class="absolute top-0 -bottom-6 left-0 flex w-6 justify-center">
						<div class="w-px bg-gray-700"></div>
					</div>
				{/if}
				<div class="bg-background relative flex size-6 flex-none items-center justify-center">
					<div class="size-1.5 rounded-full bg-gray-700 ring-1 ring-gray-600"></div>
				</div>
				<p class="flex-auto py-0.5 text-xs/5">
					{#if log.text_ai}
						{log.text_ai}
					{:else}
						{log.text}
					{/if}
				</p>
				<time datetime={log.created_at} class="text-muted-foreground flex-none py-0.5 text-xs/5"
					>{dateFormatter.format(new Date(log.created_at))}</time
				>
			</li>
		{:else}
			<li>
				<p class="text-center flex-auto py-0.5 text-xs/5 text-muted-foreground">
					No logs found for this game
				</p>
			</li>
		{/each}
	</ul>
</div>
