import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		redirect(303, '/');
	}

	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error('Error signing out: ', error);
	}
	redirect(303, '/');
};
