import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/auth/login');
	}

	const userId = session.user.id;
	if (!userId) return fail(401, { message: 'User not found' });

	const { data: games, error } = await supabase
		.from('games')
		.select(
			'id, creator, code, end_at, name, participation ( profile_id, score, total_score, nickname, nickname_image_url )'
		);

	if (error) {
		return fail(500, { message: error });
	}

	const participatedGames = games
		.filter((game) => game.participation.some((p) => p.profile_id === userId))
		.sort((a, b) => new Date(b.end_at).getTime() - new Date(a.end_at).getTime());

	const allParticipations = participatedGames.flatMap((game) =>
		game.participation.filter((p) => p.profile_id === userId)
	);

	const allScores = allParticipations.flatMap((p) => p.score);

	const totalScoreAcrossGames = allScores.reduce((acc, score) => acc + score, 0);

	const average2FAScore = totalScoreAcrossGames / allScores.length;

	const averageTotalScore =
		allParticipations.reduce((acc, p) => acc + p.total_score, 0) / allParticipations.length;

	const median2FAscore = allScores.sort((a, b) => a - b)[Math.floor(allScores.length / 2)];

	const wins = participatedGames
		.map((game) => {
			const highscoreList = game.participation.sort((a, b) => b.total_score - a.total_score);
			return highscoreList[0].profile_id === userId;
		})
		.filter(Boolean).length;

	return {
		stats: {
			numberOfGames: participatedGames.length,
			allScores,
			totalScoreAcrossGames,
			average2FAScore,
			averageTotalScore,
			median2FAscore,
			wins
		},
		title: 'Stats'
	};
};
