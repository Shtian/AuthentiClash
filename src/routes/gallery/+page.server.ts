import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const session = await safeGetSession();
	if (!session || !session.user) {
		redirect(303, '/auth/login');
	}

	const userId = session.user.id;
	if (!userId) return error(401, { message: 'User not found' });

	const { data: games, error: gamesError } = await supabase
		.from('games')
		.select(
			'id, creator, code, end_at, name, participation ( profile_id, score, total_score, nickname, nickname_image_url )'
		)
		.eq('participation.profile_id', session.user.id);

	if (gamesError) {
		return error(500, { message: gamesError.message });
	}

	return {
		games: games || [],
		profileId: userId,
		title: 'Gallery'
	};
};
