<script lang="ts">
	import { ChevronDown, Info } from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Button } from '$lib/components/ui/button';
</script>

<Collapsible.Root class="mb-4 space-y-2 rounded-md border p-4">
	<p class="text-sm text-gray-400"><time datetime="2024-12-09">2024-12-09</time></p>
	<h4 class="inline-flex items-center gap-x-2 font-semibold">
		<Info class=" size-4" />New Feature: Classes and Abilities!
	</h4>
	<Collapsible.Content class="space-y-2">
		<p>Players can now choose a class with a unique ability when joining a game:</p>
		<ul class="my-2 ml-4 list-disc">
			<li><strong>🗡️ Thief:</strong> Steal points from the player with the highest score!</li>
			<li><strong>☠️ Necromancer:</strong> Attack other players with crimson reap!</li>
			<li><strong>💪 Barbarian:</strong> Double your 2FA code score!</li>
		</ul>
		<p>Activate your ability strategically for a competitive edge!</p>
	</Collapsible.Content>
	<Collapsible.Trigger asChild let:builder>
		<Button builders={[builder]} variant="link" size="sm" class="group flex pl-0"
			><span class="group-data-[state=open]:hidden">Read more</span>
			<span class="group-data-[state=closed]:hidden">Read less</span>
			<ChevronDown class="transition-transform group-data-[state=open]:rotate-180" /></Button
		>
	</Collapsible.Trigger>
</Collapsible.Root>
