import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const session = await safeGetSession();
	if (!session) {
		redirect(303, '/auth/login');
	}

	const userId = session.user?.id;
	if (!userId) return error(401, { message: 'User not found' });

	const { data: games, error: gamesError } = await supabase
		.from('games')
		.select(
			'id, creator, code, end_at, name, participation ( profile_id, score, total_score, nickname, nickname_image_url )'
		);

	if (gamesError) {
		return error(500, { message: gamesError.message });
	}

	const participatedGames = games
		.filter(
			(game) =>
				game.participation.length > 1 && // Only games with more than 1 player
				new Date(game.end_at).getTime() < new Date().getTime() && // Only games that have ended
				game.participation.some((p: { profile_id: string }) => p.profile_id === userId) // Only games that the user participated in
		)
		.toSorted((a, b) => new Date(a.end_at).getTime() - new Date(b.end_at).getTime());

	const allParticipations = participatedGames.flatMap((game) =>
		game.participation.filter((p: { profile_id: string }) => p.profile_id === userId)
	);

	const allScores = allParticipations.flatMap((p) => p.score);

	const totalScoreAcrossGames = allScores.reduce((acc, score) => acc + score, 0);

	const average2FAScore = totalScoreAcrossGames / allScores.length;

	const averageTotalScore =
		allParticipations.reduce((acc, p) => acc + p.total_score, 0) / allParticipations.length;

	const median2FAscore = allScores.toSorted((a, b) => a - b)[Math.floor(allScores.length / 2)];

	const winsAndLosses = participatedGames.map((game) => {
		const highscoreList = game.participation.toSorted(
			(a: { total_score: number }, b: { total_score: number }) => b.total_score - a.total_score
		);
		return {
			isWin: highscoreList[0].profile_id === userId,
			isLoss: highscoreList.at(-1)?.profile_id === userId
		};
	});
	const wins = winsAndLosses.filter((w) => w.isWin).length;
	const losses = winsAndLosses.filter((w) => w.isLoss).length;

	return {
		stats: {
			numberOfGames: participatedGames.length,
			allScores,
			totalScoreAcrossGames,
			average2FAScore,
			averageTotalScore,
			median2FAscore,
			wins,
			losses
		},
		title: 'Stats'
	};
};
