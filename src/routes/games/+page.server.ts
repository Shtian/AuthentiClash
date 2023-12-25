import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession, supabase, user } }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/auth/login');
	}

	const { data: games, error } = await supabase
		.from('games')
		.select('id, creator, code, participation ( profile_id, score, nickname )');
	if (error) {
		return fail(500, { message: error });
	}

	const participatingGames = games.filter(
		(game) =>
			game.creator === user.data.user?.id ||
			game.participation.some((participation) => participation.profile_id === user.data.user?.id)
	);

	return {
		participatingGames
	};
};
