import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { getSession, supabase } }) => {
	const session = await getSession();
	const { code } = params;
	if (!session) {
		redirect(303, '/auth/login');
	}

	const { data, error: err } = await supabase
		.from('games')
		.select(
			'code, creator, end_at, is_active, name, participation ( id, score, profile_id, updated_at, nickname )'
		)
		.eq('code', code)
		.single();

	if (!data) {
		error(404, { message: `Game ${code} not found` });
	}

	if (err) {
		error(500, { message: err });
	}

	console.log('retrieved data', data);
	return {
		game: data
	};
};
