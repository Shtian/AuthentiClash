import { tryUnlockBadge } from '$lib/supabase/badges';
import { getAllGamesByUserId } from '$lib/supabase/games';

export const checkForRankingBadge = async (userId: string): Promise<void> => {
	const gamesRes = await getAllGamesByUserId(userId);
	if (gamesRes.type === 'error') {
		console.error('Error getting games by user id:', gamesRes.error.message);
		return;
	}

	const games = gamesRes.data;
	const gamesWithRankings = games
		.filter((game) => new Date(game.end_at).getTime() < new Date().getTime())
		.filter((game) => game.participation.length > 1)
		.map((game) => {
			const sortedParticipations = game.participation?.toSorted((a, b) => {
				const aScore = a.total_score;
				const bScore = b.total_score;
				return bScore - aScore;
			});
			const userRankIndex = sortedParticipations.findIndex((p) => p.profile_id === userId);
			const userRank = userRankIndex === -1 ? 0 : userRankIndex + 1;
			return {
				rank: userRank,
				win: userRank === 1,
				loss: userRank == sortedParticipations.length,
				date: game.end_at,
				players: sortedParticipations.length
			};
		});

	const wins = gamesWithRankings.filter((g) => g.win).length;

	if (wins >= 1) {
		await tryUnlockBadge('first-blood', userId);
	}

	if (wins >= 5) {
		await tryUnlockBadge('high-five', userId);
	}

	if (wins >= 10) {
		await tryUnlockBadge('fellowship-of-the-win', userId);
	}

	if (wins >= 20) {
		await tryUnlockBadge('20-20-victory-vision', userId);
	}

	if (wins >= 50) {
		await tryUnlockBadge('authentichampion', userId);
	}

	const losses = gamesWithRankings.filter((g) => g.loss).length;

	if (losses >= 1) {
		await tryUnlockBadge('rite-of-passage', userId);
	}

	if (losses >= 5) {
		await tryUnlockBadge('echoes-from-the-abyss', userId);
	}
};
