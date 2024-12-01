import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUsername } from '$lib/supabase/profiles';
import { joinGame } from '$lib/supabase/participation';

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

	if (currentPlayer) {
		redirect(303, `/games/${code}`);
	}

	return {
		message: 'Joining game',
		joinedGame: false,
		endsAt: data.end_at,
		gameId: data.id,
		gameName: data.name,
		aiEnabled: data.ai_enabled
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
	joinGame: async ({ request, locals: { getSession } }) => {
		const formData = await request.formData();
		const nickname = formData.get('nickname');
		const game_id = formData.get('game-id');
		const session = await getSession();

		if (!session) {
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
			patchedNickname
		);

		if (addParticipationRes.type === 'error') {
			return fail(500, {
				nickname,
				message: 'Oh no, something went wrong. Please try again. 🙏',
				joinedGame: false
			});
		}

		return {
			message: `Game joined 🎉 Good luck, ${nickname}!`,
			joinedGame: true
		};
	}
};
