import { tryUnlockBadge } from '$lib/supabase/badges';
import { getAllGamesByUserId } from '$lib/supabase/games';
type GameWithRankings = {
	rank: number;
	win: boolean;
	loss: boolean;
	date: string;
	players: number;
	userTotalScore: number;
	qualifiesForTwinzies: boolean;
};
export const checkForRankingBadge = async (userId: string): Promise<void> => {
	const gamesRes = await getAllGamesByUserId(userId);
	if (gamesRes.type === 'error') {
		console.error('Error getting games by user id:', gamesRes.error.message);
		return;
	}

	const games = gamesRes.data;
	const gamesWithRankings: Array<GameWithRankings> = games
		.filter((game) => new Date(game.end_at).getTime() < new Date().getTime())
		.filter((game) => game.participation.length > 1)
		.toSorted((a, b) => new Date(a.end_at).getTime() - new Date(b.end_at).getTime())
		.map((game) => {
			const sortedParticipations = game.participation?.toSorted((a, b) => {
				const aScore = a.total_score;
				const bScore = b.total_score;
				return bScore - aScore;
			});
			const userRankIndex = sortedParticipations.findIndex((p) => p.profile_id === userId);
			const userRank = userRankIndex === -1 ? 0 : userRankIndex + 1;
			const userTotalScore = sortedParticipations.at(userRankIndex)?.total_score ?? 0;
			const qualifiesForTwinzies = sortedParticipations.some(
				(p) => p.profile_id !== userId && userTotalScore > 0 && p.total_score === userTotalScore
			);
			return {
				rank: userRank,
				win: userRank === 1,
				loss: userRank == sortedParticipations.length,
				date: game.end_at,
				players: sortedParticipations.length,
				userTotalScore,
				qualifiesForTwinzies
			};
		});

	const wins = gamesWithRankings.filter((g) => g.win).length;
	await awardWins(userId, wins);

	const losses = gamesWithRankings.filter((g) => g.loss).length;
	await awardLosses(userId, losses);

	await awardWinAfterLoss(userId, gamesWithRankings);

	await awardLossAfterWin(userId, gamesWithRankings);

	await awardTotalScore(userId, gamesWithRankings);

	await awardTwinziesScore(userId, gamesWithRankings);
};

const awardWins = async (userId: string, wins: number) => {
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
};

const awardLosses = async (userId: string, losses: number) => {
	if (losses >= 1) {
		await tryUnlockBadge('rite-of-passage', userId);
	}

	if (losses >= 5) {
		await tryUnlockBadge('echoes-from-the-abyss', userId);
	}
};

const awardWinAfterLoss = async (userId: string, gamesWithRankings: Array<GameWithRankings>) => {
	if (gamesWithRankings.length < 2) return;
	for (let i = 0; i < gamesWithRankings.length - 1; i++) {
		const currentGame = gamesWithRankings[i];
		const nextGame = gamesWithRankings[i + 1];
		if (currentGame.loss && nextGame.win) {
			await tryUnlockBadge('comeback-kid', userId);
			break;
		}
	}
};

const awardLossAfterWin = async (userId: string, gamesWithRankings: Array<GameWithRankings>) => {
	if (gamesWithRankings.length < 2) return;
	for (let i = 0; i < gamesWithRankings.length - 1; i++) {
		const currentGame = gamesWithRankings[i];
		const nextGame = gamesWithRankings[i + 1];
		if (currentGame.win && nextGame.loss) {
			await tryUnlockBadge('free-fall', userId);
			break;
		}
	}
};

const awardTotalScore = async (userId: string, gamesWithRankings: Array<GameWithRankings>) => {
	const totalScore = gamesWithRankings.reduce((acc, game) => acc + game.userTotalScore, 0);
	if (totalScore >= 1000) {
		await tryUnlockBadge('humble-beginnings', userId);
	}
	if (totalScore >= 5000) {
		await tryUnlockBadge('hoarder', userId);
	}
	if (totalScore > 9000) {
		await tryUnlockBadge('its-over-9000', userId);
	}
};

const awardTwinziesScore = async (userId: string, gamesWithRankings: Array<GameWithRankings>) => {
	if (gamesWithRankings.some((game) => game.qualifiesForTwinzies)) {
		await tryUnlockBadge('twinzies', userId);
	}
};
