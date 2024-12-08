import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { updateParticipationNicknameImage } from '$lib/supabase/participation';
import { generateImage } from '$lib/ai/image-generator';
import { createSuccessMessage } from '$lib/utils/event-message-generator';
import { PARTICIPANT_AVATARS_BUCKET, uploadParticipantImage } from '$lib/supabase/storage';
import { checkForValueEntryBadge } from '$lib/badges/valueEntryBadges';
import { getGame } from '$lib/supabase/games';
import { getClass } from '$lib/supabase/classes';
import { handleScoreUpdate } from './score-engine';

export const load: PageServerLoad = async ({ params, locals: { getSession } }) => {
	const session = await getSession();
	const { code } = params;
	if (!session) {
		redirect(303, '/auth/login');
	}

	const res = await getGame(code);

	if (res.type === 'error') {
		error(500, { message: res.error.message });
	}

	if (!res.data) {
		error(404, { message: `Game ${code} not found` });
	}

	const currentPlayer = res.data.participation.find((p) => p.profileId === session.user.id);
	if (!currentPlayer) {
		redirect(303, `/games/${code}/join`);
	}

	const classResponse = await getClass(currentPlayer.classId);

	return {
		endsAt: res.data.end_at,
		gameId: res.data.id,
		gameName: res.data.name,
		cooldownHours: res.data.cooldown_hours,
		players: res.data.participation,
		currentPlayer,
		class: classResponse.data,
		title: res.data.name,
		aiEnabled: res.data.ai_enabled,
		description: 'A new game has begun! Enter your score and see what happens'
	};
};

export const actions = {
	updateScore: async ({ request, locals: { getSession } }) => {
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const scoreInput = formData.get('2fa-score');
		const game_id = formData.get('game-id');
		const ability_id = formData.get('ability-id');
		const abilityId = ability_id?.toString() ?? null;
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

		const scoreUpdateRes = await handleScoreUpdate(
			score,
			session.user.id,
			game_id!.toString(),
			abilityId
		);

		if (scoreUpdateRes.type === 'error') {
			console.error('Error updating score', JSON.stringify(scoreUpdateRes.error));
			return fail(500, {
				nickname,
				score,
				message: scoreUpdateRes.error.message
			});
		}

		const badgeRes = await checkForValueEntryBadge(scoreUpdateRes.data.newScore, session.user.id);

		return {
			message: abilityId
				? scoreUpdateRes.data.message
				: createSuccessMessage(scoreUpdateRes.data.newScore),
			unlockBadgeStatus: badgeRes
		};
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
