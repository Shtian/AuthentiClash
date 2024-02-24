import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/auth/login');
	}

	const { data: games, error } = await supabase
		.from('games')
		.select(
			'id, creator, code, end_at, name, participation ( profile_id, score, total_score, nickname )'
		);

	if (error) {
		return fail(500, { message: error });
	}

	const userId = session.user.id;
	if (!userId) return fail(401, { message: 'User not found' });

	const participatingGames = (games || []).filter(
		(game) =>
			game.creator === userId ||
			game.participation.some((participation) => participation.profile_id === userId)
	);

	return {
		participatingGames,
		profileId: userId,
		title: 'Games'
	};
};
