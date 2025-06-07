import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const session = await safeGetSession();

	if (!session || !session.user) {
		redirect(303, '/');
	}

	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error('Error signing out: ', error);
	}
	redirect(303, '/');
};
