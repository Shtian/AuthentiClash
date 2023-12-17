import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();

	// if the user is already logged in return them to the games page
	if (session) {
		redirect(303, '/games');
	}
};

export const actions = {
	signIn: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { error: error.message, email });
		}

		redirect(303, '/games');
	},
	signUp: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			return fail(400, { error: error.message, email });
		}

		return { success: true, registeredEmail: email };
	}
};
