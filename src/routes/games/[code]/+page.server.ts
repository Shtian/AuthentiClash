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
import { PARTICIPANT_AVATARS_BUCKET, uploadParticipantImage } from '$lib/supabase/storage';
import { checkForValueEntryBadge } from '$lib/badges/valueEntryBadges';
import { getUsername } from '$lib/supabase/profiles';

const getPatchedNickname = async (nickname: string, userId: string) => {
	if (nickname.includes('(')) {
		console.debug('Nickname already contains username', nickname);
		return nickname;
	}

	const usernameRes = await getUsername(userId);
	if (usernameRes.type === 'error') {
		console.error('Error getting username', usernameRes.error);
		return nickname;
	}

	const username = usernameRes.data;
	if (!username) {
		return nickname;
	}

	return `${nickname} (${username})`;
};

export const load: PageServerLoad = async ({ params, locals: { getSession, supabase } }) => {
	const session = await getSession();
	const { code } = params;
	if (!session) {
		redirect(303, '/auth/login');
	}

	const { data, error: err } = await supabase
		.from('games')
		.select(
			'id, code, creator, end_at, is_active, name, cooldown_hours, ai_enabled, participation ( id, score, total_score, profile_id, updated_at, nickname_image_url, nickname )'
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
		aiEnabled: data.ai_enabled,
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
		if (score < 1 || score > 99) {
			return fail(400, {
				nickname,
				score: scoreInput,
				message: 'Score has to be 1-99. Please try again.'
			});
		}

		if (!isParticipating) {
			const patchedNickname = await getPatchedNickname(nickname!.toString(), session.user.id);
			const addParticipationRes = await addParticipation(
				game_id!.toString(),
				session.user.id,
				patchedNickname,
				score
			);

			if (addParticipationRes.type === 'error') {
				return fail(500, {
					nickname,
					score,
					message: 'Oh no, something went wrong. Please try again. 🙏'
				});
			}

			const badgeRes = await checkForValueEntryBadge(score, session.user.id);

			return {
				message: createSuccessMessage(score),
				unlockBadgeStatus: badgeRes
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

			const badgeRes = await checkForValueEntryBadge(score, session.user.id);

			return {
				message: createSuccessMessage(score),
				unlockBadgeStatus: badgeRes
			};
		}
	},
	generateParticipantImage: async ({ request, locals: { getSession, supabase } }) => {
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

		const uploadRes = await uploadParticipantImage(
			imageUrl,
			session.user.id,
			participationId.toString()
		);

		if (uploadRes.type === 'error' || !uploadRes.data?.fullPath) {
			return fail(500, {
				message: 'Oh no, your image could not be uploaded. Please try again. 🙏'
			});
		}

		const { data } = supabase.storage
			.from(PARTICIPANT_AVATARS_BUCKET)
			.getPublicUrl(uploadRes.data.fullPath);
		const res = await updateParticipationNicknameImage(data.publicUrl, participationId.toString());

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
