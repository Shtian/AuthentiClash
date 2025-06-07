import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const session = await safeGetSession();

	if (!session || !session.user) {
		redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('username, website, avatar_url')
		.eq('id', session.user.id)
		.single();

	return { session: session.session, profile, title: 'Account' };
};

export const actions = {
	update: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;

		const session = await safeGetSession();
		if (!session?.user?.id) {
			return fail(401, { message: 'User not found' });
		}
		const { error } = await supabase.from('profiles').upsert({
			id: session?.user?.id,
			username,
			updated_at: new Date()
		});

		if (error) {
			return fail(500, {
				username,
				session,
				message: 'Oh no, something went wrong. Please try again. 🙏'
			});
		}

		return {
			username,
			session,
			message: 'Your username has been updated!'
		};
	}
} satisfies Actions;
