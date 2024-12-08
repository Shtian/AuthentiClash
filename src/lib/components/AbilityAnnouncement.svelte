<script lang="ts">
	import { ChevronDown, Info } from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Button } from '$lib/components/ui/button';
</script>

<Collapsible.Root class="mb-4 space-y-2 rounded-md border p-4">
	<p class="text-sm text-gray-400"><time datetime="2024-12-09">2024-12-09</time></p>
	<h4 class="font-semibold">
		<Info class="mr-2 inline-block size-4" />New Feature: Classes and Abilities!
	</h4>
	<Collapsible.Content class="space-y-2">
		<p>Players can now activate single use abilities to gain an advantage in the game!</p>
		<ul class="my-2 ml-4 list-disc">
			<li>
				💰 Thief: Steal 20-40 points from the player with the highest score and add it to your 2FA
				code score (max 99)
			</li>
			<li>☠️ Necromancer: Reduce up to 5 opponents' score with 10-20 points</li>
			<li>💪 Barbarian: Double your 2FA code score (max 99)</li>
		</ul>
		<p>Activate your ability strategically for a competitive edge!</p>
	</Collapsible.Content>
	<Collapsible.Trigger asChild let:builder>
		<Button builders={[builder]} variant="link" size="sm" class="pl-0"
			>Read more <ChevronDown /></Button
		>
	</Collapsible.Trigger>
</Collapsible.Root>
