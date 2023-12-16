<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';

	export let data;
</script>

<Auth
	supabaseClient={data.supabase}
	view="sign_in"
	redirectTo={`${data.url}/auth/callback`}
	showLinks={true}
	providers={['github']}
/>
