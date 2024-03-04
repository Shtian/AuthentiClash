import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	addParticipation,
	getParticipation,
	updateParticipationNicknameImage,
	updateParticipationScore
} from '$lib/supabase/participation';
import { generateImage } from '$lib/ai/image-generator';
import { createSuccessMessage } from '$lib/utils/event-message-generator';

export const load: PageServerLoad = async ({ params, locals: { getSession, supabase } }) => {
	const session = await getSession();
	const { code } = params;
	if (!session) {
		redirect(303, '/auth/login');
	}

	const { data, error: err } = await supabase
		.from('games')
		.select(
			'id, code, creator, end_at, is_active, name, cooldown_hours, participation ( id, score, total_score, profile_id, updated_at, nickname_image_url, nickname )'
		)
		.eq('code', code)
		.single();

	if (!data) {
		error(404, { message: `Game ${code} not found` });
	}

	if (err) {
		error(500, { message: err });
	}

	const currentPlayer = data.participation.find((p) => p.profile_id === session.user.id);
	return {
		endsAt: data.end_at,
		gameId: data.id,
		gameName: data.name,
		cooldownHours: data.cooldown_hours,
		players: data.participation,
		currentPlayer,
		title: data.name,
		description: 'A new game has begun! Enter your score and see what happens'
	};
};

export const actions = {
	updateScore: async ({ request, locals: { getSession } }) => {
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const scoreInput = formData.get('2fa-score');
		const isParticipating = formData.get('is-participating') === 'true';
		const game_id = formData.get('game-id');
		const session = await getSession();

		if (!session) {
			return fail(401, {
				nickname,
				score: scoreInput,
				message: 'No login session found. Please login and try again.'
			});
		}

		if (!scoreInput) {
			return fail(400, {
				nickname,
				score: scoreInput,
				message: 'Invalid score value. Please try again.'
			});
		}
		const score = parseInt(scoreInput.toString(), 10);

		if (!isParticipating) {
			const addParticipationRes = await addParticipation(
				game_id!.toString(),
				session.user.id,
				nickname!.toString(),
				score
			);

			if (addParticipationRes.type === 'error') {
				return fail(500, {
					nickname,
					score,
					message: 'Oh no, something went wrong. Please try again. 🙏'
				});
			}

			return {
				message: createSuccessMessage(score)
			};
		} else {
			const res = await getParticipation(session.user.id, game_id!.toString());
			if (res.type === 'error') {
				console.error('Error getting existing participation', JSON.stringify(res.error));
				return fail(500, {
					nickname,
					score,
					message: 'Oh no, something went wrong. Please try again. 🙏'
				});
			}
			const { data: participation } = res;

			const updateParticipationRes = await updateParticipationScore(score, participation);

			if (updateParticipationRes.type === 'error') {
				console.error('Error updating score', JSON.stringify(error));
				return fail(500, {
					nickname,
					score,
					message: 'Oh no, something went wrong. Please try again. 🙏'
				});
			}

			return {
				message: createSuccessMessage(score)
			};
		}
	},
	generateParticipantImage: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (!session) {
			return fail(401, {
				message: 'No login session found. Please login and try again.'
			});
		}
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const participationId = formData.get('participation-id');

		if (nickname === null || participationId === null) {
			return fail(400, {
				message: 'Invalid nickname or participation id.'
			});
		}

		const imageUrl = await generateImage(nickname.toString());
		if (!imageUrl) {
			return fail(500, {
				message: 'Oh no, your image could not be generated. Please try again. 🙏'
			});
		}

		const res = await updateParticipationNicknameImage(imageUrl, participationId.toString());
		if (res.type === 'error') {
			return fail(500, {
				message: 'Oh no, your image could not be updated. Please try again. 🙏'
			});
		}

		return {
			message: 'Your participation image has been generated!'
		};
	}
};
