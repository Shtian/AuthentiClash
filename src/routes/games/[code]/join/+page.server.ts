import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUsername } from '$lib/supabase/profiles';
import { joinGame } from '$lib/supabase/participation';
import { getAllClasses } from '$lib/supabase/classes';
import { getGame } from '$lib/supabase/games';
import { addGameLogWithAI } from '$lib/supabase/gameLog';
import { getClassName } from '$lib/classes/classes';

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

	if (currentPlayer) {
		redirect(303, `/games/${code}`);
	}

	const classResponse = await getAllClasses();
	const classes = classResponse.type === 'success' ? classResponse.data : [];

	return {
		message: 'Joining game',
		joinedGame: false,
		endsAt: res.data.end_at,
		gameId: res.data.id,
		gameName: res.data.name,
		aiEnabled: res.data.ai_enabled,
		classes
	};
};

const getPatchedNickname = async (nickname: string, userId: string) => {
	if (nickname.includes('(')) {
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

export const actions = {
	joinGame: async ({ request, locals: { safeGetSession } }) => {
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const game_id = formData.get('game-id');
		const class_id = formData.get('class-id');
		const session = await safeGetSession();

		if (!session || !session.user) {
			return fail(401, {
				nickname,
				message: 'No login session found. Please login and try again.',
				joinedGame: false
			});
		}

		const patchedNickname = await getPatchedNickname(nickname!.toString(), session.user.id);
		const addParticipationRes = await joinGame(
			game_id!.toString(),
			session.user.id,
			patchedNickname,
			class_id!.toString()
		);

		if (addParticipationRes.type === 'error') {
			return fail(500, {
				nickname,
				message: 'Oh no, something went wrong. Please try again. 🙏',
				joinedGame: false
			});
		}

		await addGameLogWithAI(
			game_id!.toString(),
			`${patchedNickname} joined the game as a ${getClassName(parseInt(class_id!.toString(), 10))} ⚔️`
		);

		return {
			message: `Game joined, redirecting 🎉 Good luck, ${nickname}!`,
			joinedGame: true
		};
	}
};
