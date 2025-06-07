import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, safeGetSession } }) => {
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
