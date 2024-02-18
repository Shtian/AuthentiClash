import { error, fail, redirect } from '@sveltejs/kit';
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
			'id, code, creator, end_at, is_active, name, cooldown_hours, participation ( id, score, profile_id, updated_at, nickname )'
		)
		.eq('code', code)
		.single();

	if (!data) {
		error(404, { message: `Game ${code} not found` });
	}

	if (err) {
		error(500, { message: err });
	}

	return {
		game: data
	};
};

export const actions = {
	updateScore: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const score = formData.get('2fa-score');
		const isParticipating = formData.get('is-participating') === 'true';
		const game_id = formData.get('game-id');
		const session = await getSession();
		if (!session) {
			return fail(401, {
				nickname,
				score
			});
		}

		if (!isParticipating) {
			const participation = {
				nickname,
				score: [score],
				profile_id: session.user.id,
				game_id,
				created_at: new Date(),
				updated_at: new Date()
			};

			const { data, error } = await supabase.from('participation').insert(participation).single();

			if (error) {
				return fail(500, {
					nickname,
					score
				});
			}

			return {
				participation: data
			};
		} else {
			const { data: existingParticipation, error: existingParticipationError } = await supabase
				.from('participation')
				.select('id, score')
				.eq('game_id', game_id)
				.eq('profile_id', session.user.id)
				.single();

			if (existingParticipationError || !existingParticipation)
				return fail(500, { nickname, score });

			const newScore = [...existingParticipation.score, score];
			const { data, error } = await supabase
				.from('participation')
				.update({ score: newScore, updated_at: new Date() })
				.eq('id', existingParticipation.id)
				.single();

			if (error) {
				return fail(500, {
					nickname,
					score
				});
			}

			return {
				participation: data
			};
		}
	}
};
