import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/auth/login');
	}

	const userId = session.user.id;
	if (!userId) return fail(401, { message: 'User not found' });

	const { data: games, error } = await supabase
		.from('games')
		.select(
			'id, creator, code, end_at, name, participation ( profile_id, score, total_score, nickname, nickname_image_url )'
		)
		.eq('participation.profile_id', session.user.id);

	if (error) {
		return fail(500, { message: error });
	}
	console.log(games);

	return {
		games: games || [],
		profileId: userId,
		title: 'Gallery'
	};
};
