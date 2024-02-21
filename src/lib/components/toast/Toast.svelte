<script lang="ts">
	import Portal from '../Portal.svelte';
	import { toast } from '$lib/stores/ToastStore';
	import VisuallyHidden from '../VisuallyHidden.svelte';
	import { CheckCircle2, X } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ToastMessage from '$lib/components/toast/ToastMessage.svelte';
	import ToastProgress from '$lib/components/toast/ToastProgress.svelte';
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			toast.remove();
		}
	}}
/>

<Portal>
	<div class="fixed top-5 left-1/2 z-toast -translate-x-1/2">
		{#each $toast as toastContent (toastContent.id)}
			<div
				class="relative px-2 py-4 backdrop-blur-3xl flex gap-4 items-center mb-2 rounded-sm border border-slate-800 w-80"
				in:fly={{ opacity: 0, y: -100 }}
				out:fade={{ duration: 300 }}
				animate:flip={{ duration: 300 }}
			>
				<CheckCircle2 class="h-6 w-6 text-green-600 flex-shrink-0 self-start" />
				<ToastMessage
					class="text-pretty self-start"
					message={toastContent.message}
					duration={toastContent.duration}
				/>
				<button
					class="bg-slate-800 rounded-full p-1 hover:bg-slate-700 transition-colors"
					on:click={() => toast.remove(toastContent.id)}
					><X class="h-6 w-6 text-white "></X><VisuallyHidden>Close message</VisuallyHidden></button
				>
				<ToastProgress duration={toastContent.duration} />
			</div>
		{/each}
	</div>
</Portal>
