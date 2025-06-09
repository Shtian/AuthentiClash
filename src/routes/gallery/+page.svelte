<script lang="ts">
	import { CircleUser, RocketIcon } from 'lucide-svelte';
	import * as Popover from '$lib/components/ui/popover';

	const { data } = $props();
	const games =
		data.games
			?.filter((game) => game.participation.length > 0)
			.sort((a, b) => {
				return new Date(b.end_at).getTime() - new Date(a.end_at).getTime();
			})
			.map((game) => {
				const [participation] = game.participation;
				return {
					code: game.code,
					participation
				};
			}) || [];
</script>

<div class="lg:py-10">
	<div class="mx-auto max-w-2xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:mx-0">
			<h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
				Gallery of Legends
			</h2>
			<p class="text-foreground mt-6 text-lg leading-8">
				Your previous achievements are eternalized in the Gallery of Legends. Gaze upon your scores
				and marvel at your own greatness.
			</p>
		</div>
		{#if games.length}
			<ul
				role="list"
				class="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4"
			>
				{#each games as game (game.code)}
					<li>
						{#if game.participation.nickname_image_url}
							<a href={game.participation.nickname_image_url} target="_blank">
								<img
									class="mx-auto h-24 w-24 rounded-full"
									src={game.participation.nickname_image_url.replace('.webp', '-512.webp')}
									alt={game.participation.nickname}
								/>
							</a>
						{:else}
							<CircleUser class="mx-auto h-24 w-24 text-gray-600" />
						{/if}
						<h3 class="text-foreground mt-6 text-base leading-7 font-semibold tracking-tight">
							<a href={`/games/${game.code}`}
								>{game.participation.nickname.replace(/\(.*\)/, '').trim()}</a
							>
						</h3>
						<Popover.Root>
							<Popover.Trigger
								><p class="text-muted-foreground text-sm leading-6">
									Score: {game.participation.total_score}
								</p>
							</Popover.Trigger>
							<Popover.Content class="w-max text-sm text-pretty">
								<p>{game.participation.score.join(' → ')}</p>
							</Popover.Content>
						</Popover.Root>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="mx-auto max-w-7xl py-6 text-center sm:px-6 lg:px-8 lg:py-10">
				<RocketIcon class="text-muted-foreground mx-auto h-12 w-12" />
				<h3 class="text-foreground mt-2 text-sm font-semibold">No past games found</h3>
				<p class="text-foreground mt-1 text-sm">
					Get started by creating a new AuthentiClash session.
				</p>
				<div class="mt-6">
					<a
						href="/games/create"
						type="button"
						class="bg-clash-600 hover:bg-clash-500 focus-visible:outline-clash-600 text-foreground inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
					>
						<svg
							class="mr-1.5 -ml-0.5 h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
							/>
						</svg>
						New AuthentiClash
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
