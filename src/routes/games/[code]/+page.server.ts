import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	updateParticipationNicknameImage,
	getGameParticipations,
	type Participation
} from '$lib/supabase/participation';
import { generateEndgameImageB64, generateImageFal } from '$lib/ai/image-generator';
import {
	PARTICIPANT_AVATARS_BUCKET,
	uploadParticipantImage,
	GAME_IMAGES_BUCKET,
	uploadGameImage,
	uploadParticipantImageFromUrl
} from '$lib/supabase/storage';
import { checkForValueEntryBadge } from '$lib/badges/valueEntryBadges';
import { checkForAbilityBadge } from '$lib/badges/abilityBadges';
import { getGame, getGameBackgroundPrompt, setGameEndgameImageUrl } from '$lib/supabase/games';
import { getClass } from '$lib/supabase/classes';
import { handleScoreUpdate } from './score-engine';
import { getGameLogs } from '$lib/supabase/gameLog';

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
	const session = await safeGetSession();
	const { code } = params;
	if (!session || !session.user) {
		redirect(303, '/auth/login');
	}
	const res = await getGame(code);

	if (res.type === 'error') {
		error(500, { message: res.error.message });
	}

	if (!res.data) {
		error(404, { message: `Game ${code} not found` });
	}

	const currentPlayer = res.data.participation.find((p) => p.profileId === session.user!.id);
	if (!currentPlayer) {
		redirect(303, `/games/${code}/join`);
	}

	const classResponse = await getClass(currentPlayer.classId);

	const gameLogs = await getGameLogs(res.data.id.toString());

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
		endgameImageUrl: res.data.endgame_image_url,
		logs: gameLogs.data || [],
		description: 'A new game has begun! Enter your score and see what happens'
	};
};

export const actions = {
	updateScore: async ({ request, locals: { safeGetSession } }) => {
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const scoreInput = formData.get('2fa-score');
		const game_id = formData.get('game-id');
		const ability_id = formData.get('ability-id');
		const abilityId = ability_id?.toString() ?? null;
		const session = await safeGetSession();

		if (!session || !session.user) {
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

		// Capture pre-ability participation state for consistent badge evaluation
		let preParticipations: Participation[] | undefined;
		let mePre: Participation | undefined;
		if (abilityId) {
			const preRes = await getGameParticipations(game_id!.toString());
			if (preRes.type === 'success') {
				preParticipations = preRes.data;
				mePre = preParticipations.find((p) => p.profileId === session.user!.id);
			}
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

		// Count badges unlocked by value thresholds and ability usage (e.g., Judgment Day).
		const valueBadgeCount = await checkForValueEntryBadge(
			scoreUpdateRes.data.newScore,
			session.user.id
		);
		const abilityBadgeCount = await checkForAbilityBadge(
			abilityId,
			session.user.id,
			game_id!.toString(),
			{ preParticipation: mePre, preParticipations }
		);
		const badgeRes = valueBadgeCount + abilityBadgeCount;

		return {
			message: scoreUpdateRes.data.message,
			unlockBadgeStatus: badgeRes
		};
	},
	generateParticipantImage: async ({ request, locals: { safeGetSession, supabase } }) => {
		const session = await safeGetSession();
		if (!session || !session.user) {
			return fail(401, {
				message: 'No login session found. Please login and try again.'
			});
		}
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const participationId = formData.get('participation-id');
		const gameId = formData.get('game-id');

		if (nickname === null || participationId === null || gameId === null) {
			return fail(400, {
				message: 'Invalid nickname, participation id, or game id.'
			});
		}

		// Get just the background prompt for the game
		const backgroundPromptRes = await getGameBackgroundPrompt(gameId.toString());
		if (backgroundPromptRes.type === 'error') {
			console.error('Error getting background prompt:', backgroundPromptRes.error.message);
			// Continue with random background if we can't get the prompt
		}

		const backgroundPrompt =
			backgroundPromptRes.type === 'success' ? backgroundPromptRes.data : undefined;
		const url = await generateImageFal(nickname.toString(), backgroundPrompt || undefined);
		if (!url) {
			return fail(500, {
				message: 'Oh no, your image could not be generated. Please try again. 🙏'
			});
		}

		const uploadRes = await uploadParticipantImageFromUrl(
			url,
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
	},
	generateEndgameImage: async ({ request, locals: { safeGetSession, supabase } }) => {
		const session = await safeGetSession();
		if (!session || !session.user) {
			return fail(401, { message: 'No login session found. Please login and try again.' });
		}

		const formData = await request.formData();
		const gameId = formData.get('game-id');
		if (!gameId) {
			return fail(400, { message: 'Invalid game id.' });
		}

		const [playersRes, bgPromptRes] = await Promise.all([
			getGameParticipations(gameId.toString()),
			getGameBackgroundPrompt(gameId.toString())
		]);

		if (playersRes.type === 'error') {
			console.error('Error loading players for endgame image:', playersRes.error.message);
			return fail(500, { message: 'Could not load players for image generation.' });
		}

		const players = (playersRes.data || []).slice().sort((a, b) => b.totalScore - a.totalScore);
		if (players.length === 0) {
			return fail(400, { message: 'No players found for this game.' });
		}

		const winner = players[0];
		const competitors = players.slice(1).map((p) => p.nickname);
		const backgroundPrompt = bgPromptRes.type === 'success' ? bgPromptRes.data : undefined;

		const b64 = await generateEndgameImageB64(winner.nickname, competitors, backgroundPrompt);
		if (!b64) {
			return fail(500, { message: 'Could not generate endgame image. Please try again.' });
		}

		const uploadRes = await uploadGameImage(b64, gameId.toString());
		if (uploadRes.type === 'error' || !uploadRes.data?.fullPath) {
			return fail(500, { message: 'Could not upload endgame image. Please try again.' });
		}

		const { data } = supabase.storage
			.from(GAME_IMAGES_BUCKET)
			.getPublicUrl(uploadRes.data.fullPath);

		// Persist on the game for later refreshes
		const updateRes = await setGameEndgameImageUrl(gameId.toString(), data.publicUrl);
		if (updateRes.type === 'error') {
			console.error('Failed to persist endgame image url:', updateRes.error.message);
			// Non-fatal: still return the image URL to the client
		}

		return {
			message: 'Endgame image generated!',
			imageUrl: data.publicUrl
		};
	}
} satisfies Actions;
