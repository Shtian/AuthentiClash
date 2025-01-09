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
	qualifiesForLiterallyCantBelieveIt: boolean;
	qualifiesForLuckyInLove: boolean;
};

export const checkForRankingBadge = async (userId: string): Promise<void> => {
	const gamesRes = await getAllGamesByUserId(userId);
	if (gamesRes.type === 'error') {
		console.error('Error getting games by user id:', gamesRes.error.message);
		return;
	}

	const games = gamesRes.data;
	const gamesWithRankings: GameWithRankings[] = games
		.filter((game) => new Date(game.end_at).getTime() < new Date().getTime())
		.filter((game) => game.participation.length > 1)
		.toSorted((a, b) => new Date(a.end_at).getTime() - new Date(b.end_at).getTime())
		.map((game) => {
			const sortedParticipations = game.participation?.toSorted((a, b) => {
				const aScore = a.totalScore;
				const bScore = b.totalScore;
				return bScore - aScore;
			});

			const userRankIndex = sortedParticipations.findIndex((p) => p.profileId === userId);
			const userRank = userRankIndex === -1 ? 0 : userRankIndex + 1;
			const userTotalScore = sortedParticipations.at(userRankIndex)?.totalScore ?? 0;
			const userScore = sortedParticipations.at(userRankIndex)?.score ?? [];

			const qualifiesForTwinzies = sortedParticipations.some(
				(p) => p.profileId !== userId && userTotalScore > 0 && p.totalScore === userTotalScore
			);
			const qualifiesForLiterallyCantBelieveIt = checkQualifiesForLiterallyCantBelieveIt(userScore);
			const qualifiesForLuckyInLove = checkForQualifiesForLuckyInLove(userScore);

			return {
				rank: userRank,
				win: userRank === 1,
				loss: userRank == sortedParticipations.length,
				date: game.end_at,
				players: sortedParticipations.length,
				userTotalScore,
				qualifiesForTwinzies,
				qualifiesForLiterallyCantBelieveIt,
				qualifiesForLuckyInLove
			};
		});

	const wins = gamesWithRankings.filter((g) => g.win).length;
	await awardWins(userId, wins);

	const losses = gamesWithRankings.filter((g) => g.loss).length;
	await awardLosses(userId, losses);

	const participatedGames = gamesWithRankings.filter((g) => !g.win && !g.loss).length;
	await awardParticipation(userId, participatedGames);

	await awardWinAfterLoss(userId, gamesWithRankings);

	await awardLossAfterWin(userId, gamesWithRankings);

	await awardTotalScore(userId, gamesWithRankings);

	await awardTwinziesScore(userId, gamesWithRankings);

	await awardLiterallyCantBelieveIt(userId, gamesWithRankings);

	await awardLuckyInLove(userId, gamesWithRankings);
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

const awardParticipation = async (userId: string, participatedGames: number) => {
	if (participatedGames >= 5) {
		await tryUnlockBadge('participation-award', userId);
	}

	if (participatedGames >= 10) {
		await tryUnlockBadge('aggressively-average', userId);
	}

	if (participatedGames >= 20) {
		await tryUnlockBadge('lean-mean-authenticlash-machine', userId);
	}

	if (participatedGames >= 50) {
		await tryUnlockBadge('wouldnt-stick-out-in-a-crowd-of-one', userId);
	}
};

const awardWinAfterLoss = async (userId: string, gamesWithRankings: GameWithRankings[]) => {
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

const awardLossAfterWin = async (userId: string, gamesWithRankings: GameWithRankings[]) => {
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

const awardTotalScore = async (userId: string, gamesWithRankings: GameWithRankings[]) => {
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

const awardTwinziesScore = async (userId: string, gamesWithRankings: GameWithRankings[]) => {
	if (gamesWithRankings.some((game) => game.qualifiesForTwinzies)) {
		await tryUnlockBadge('twinzies', userId);
	}
};

const awardLiterallyCantBelieveIt = async (
	userId: string,
	gamesWithRankings: GameWithRankings[]
) => {
	if (gamesWithRankings.some((game) => game.qualifiesForLiterallyCantBelieveIt)) {
		await tryUnlockBadge('literally-cant-believe-it', userId);
	}
};

const awardLuckyInLove = async (userId: string, gamesWithRankings: GameWithRankings[]) => {
	if (gamesWithRankings.some((game) => game.qualifiesForLuckyInLove)) {
		await tryUnlockBadge('lucky-in-love', userId);
	}
};

const checkQualifiesForLiterallyCantBelieveIt = (score: number[]): boolean => {
	if (score.length < 4) return false;
	return score.every((score) => score >= 50);
};

const checkForQualifiesForLuckyInLove = (score: number[]): boolean => {
	if (score.length < 4) return false;
	return score.every((score) => score <= 50);
};
