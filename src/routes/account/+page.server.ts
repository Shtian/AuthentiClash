import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name, website, avatar_url`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
};

export const actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const fullName = formData.get('fullName') as string;
		const username = formData.get('username') as string;

		const session = await getSession();

		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
			full_name: fullName,
			username,
			updated_at: new Date()
		});

		if (error) {
			return fail(500, {
				fullName,
				username
			});
		}

		return {
			fullName,
			username
		};
	}
};
