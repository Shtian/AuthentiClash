<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Popover from '$lib/components/ui/popover';
	import { Clock, Copy, Sparkles } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		gameName: string;
		endsAt: string;
		aiEnabled: boolean;
		timeLeftText: string;
		hasEnded: boolean;
	}

	const { gameName, endsAt, aiEnabled, timeLeftText, hasEnded }: Props = $props();

	let urlIsRecentlyCopied = $state(false);
	const copyUrl = () => {
		navigator.clipboard.writeText(`https://www.authenticlash.app${window.location.pathname}/join`);
		urlIsRecentlyCopied = true;
		window.setTimeout(() => {
			urlIsRecentlyCopied = false;
		}, 3000);
	};
</script>

<header class="mx-4 max-w-7xl space-y-4 sm:mx-0">
	<div class="grid gap-y-2 sm:grid-cols-[1fr_auto]">
		<div class="flex flex-row items-center gap-2">
			<h1
				class="to-clash-600 tracking-tigh flex flex-col bg-linear-to-br from-purple-600 bg-clip-text text-5xl leading-tight font-bold text-transparent"
			>
				{gameName}
			</h1>
			<button
				type="submit"
				class="hover:text-foreground text-muted-foreground focus-visible:outline-clash-500 relative inline-flex items-center gap-x-2 self-center rounded-md bg-transparent px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
				onclick={copyUrl}
			>
				<Copy />
				{#if urlIsRecentlyCopied}
					<span class="text-foreground absolute -bottom-3.5 text-sm" in:fade out:fade>Copied!</span>
				{/if}
			</button>
		</div>
		<div class="flex items-center sm:justify-end">
			<div
				class="border-foreground/10 flex h-fit w-fit flex-row items-center gap-2 rounded-md border p-2 shadow-2xs {hasEnded
					? 'bg-destructive/20 text-foreground'
					: 'bg-zinc-50 dark:bg-zinc-800/50'}"
			>
				<Clock class="text-muted-foreground inline size-4 shrink-0" />
				<p class="text-muted-foreground text-sm text-pretty tabular-nums" title={endsAt}>
					{timeLeftText}
				</p>
			</div>
		</div>
	</div>
	{#if aiEnabled}
		<Popover.Root>
			<Popover.Trigger class="w-max">
				<Badge variant="outline" class="cursor-pointer">
					<Sparkles class="inline size-4" />AI Enabled
				</Badge>
			</Popover.Trigger>
			<Popover.Content class="text-sm text-pretty">
				AI features have been enabled for this game:
				<ul class="ml-4 list-disc">
					<li>Click the sparkles on your row to generate an epic avatar!</li>
					<li>You will also get AI generated commentary in the events section</li>
				</ul>
			</Popover.Content>
		</Popover.Root>
	{/if}
</header>
