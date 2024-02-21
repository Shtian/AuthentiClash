<script lang="ts">
	import Portal from '../Portal.svelte';
	import { toast } from '$lib/stores/ToastStore';
	import VisuallyHidden from '../VisuallyHidden.svelte';
	import { AlertTriangle, CheckCircle2, Info, MessageCircleWarning, X } from 'lucide-svelte';
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
				class="relative px-2 py-4 backdrop-blur-3xl flex items-start mb-2 rounded-sm border border-slate-800 w-80"
				in:fly={{ opacity: 0, y: -100 }}
				out:fade={{ duration: 300 }}
				animate:flip={{ duration: 300 }}
			>
				{#if toastContent.type === 'success'}
					<CheckCircle2 class="h-6 w-6 text-green-600 flex-shrink-0" />
				{:else if toastContent.type === 'error'}
					<AlertTriangle class="h-6 w-6 text-red-400 flex-shrink-0" />
				{:else if toastContent.type === 'info'}
					<Info class="h-6 w-6 flex-shrink-0" />
				{:else}
					<Info class="h-6 w-6 text-green-600 flex-shrink-0" />
				{/if}
				<ToastMessage
					class="text-pretty ml-3 text-sm"
					message={toastContent.message}
					duration={toastContent.duration}
				/>
				<button class="p-1 ml-4" on:click={() => toast.remove(toastContent.id)}
					><X class="h-4 w-4 text-gray-300 hover:text-white transition-colors"></X><VisuallyHidden
						>Close message</VisuallyHidden
					></button
				>
				<ToastProgress duration={toastContent.duration} />
			</div>
		{/each}
	</div>
</Portal>
