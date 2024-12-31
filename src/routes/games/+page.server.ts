import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getActiveGamesByUserId,
	getAllGamesCreatedByUserId,
	getEndedGamesByUserId,
	type Game
} from '$lib/supabase/games';
import { DateFormatter } from '@internationalized/date';

export const load: PageServerLoad = async ({ locals: { getSession }, url }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/auth/login');
	}
	const userId = session.user.id;
	if (!userId) return fail(401, { message: 'User not found' });

	const filter = url.searchParams.get('filter');
	const gamesByFilter = await getGamesByFilter(filter, userId);

	if (gamesByFilter.type === 'error') {
		return fail(500, { message: gamesByFilter.error.message });
	}
	const participatingGames = sortParticipationAndFindUserRank(gamesByFilter.data, userId);

	return {
		participatingGames,
		profileId: userId,
		title: 'Games'
	};
};

const sortParticipationAndFindUserRank = (games: Game[], userId: string) => {
	if (!games) return [];

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short',
		hour12: false
	});

	return games
		.map((game) => {
			const sortedParticipations = game.participation?.toSorted((a, b) => {
				const aScore = a.totalScore || 0;
				const bScore = b.totalScore || 0;
				return bScore - aScore;
			});
			const userRankIndex = sortedParticipations.findIndex((p) => p.profileId === userId);
			const userRank = userRankIndex === -1 ? 0 : userRankIndex + 1;
			const participation = game.participation.find((p) => p.profileId === userId);
			const endAtDate = new Date(game.end_at);
			return {
				id: game.id.toString(),
				name: game.name,
				code: game.code,
				totalScore: participation?.totalScore || 0,
				userRank,
				endAtString: df.format(endAtDate),
				endAtDate,
				timeToEnd: endAtDate.getTime() - Date.now()
			};
		})
		.sort((a, b) => b.timeToEnd - a.timeToEnd);
};

const getGamesByFilter = async (filter: string | null, userId: string) => {
	switch (filter) {
		case 'ended':
			return getEndedGamesByUserId(userId);
		case 'created':
			return getAllGamesCreatedByUserId(userId);
		case 'active':
		default:
			return getActiveGamesByUserId(userId);
	}
};
