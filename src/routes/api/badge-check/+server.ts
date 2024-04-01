import { checkForRankingBadge } from '$lib/badges/gameRankingBadges';
import { deactivateGame, getEndedActiveGames } from '$lib/supabase/games';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	// get all games that are active
	console.time();
	const endedActiveGamesRes = await getEndedActiveGames();
	if (endedActiveGamesRes.type === 'error') {
		return error(500, { message: endedActiveGamesRes.error.message });
	}
	const endedActiveGames = endedActiveGamesRes.data;
	console.info('endedActiveGames: ', endedActiveGames.length);
	console.timeEnd();
	console.time();
	// Get all players that have participated
	const players = endedActiveGames.flatMap((game) => game.participation);
	const uniquePlayers = [...new Set(players)];
	console.info('unique players: ', endedActiveGames.length);

	// Run a badge check for each player
	for (const player of uniquePlayers) {
		console.info('Checking for badges for player: ', player);
		await checkForRankingBadge(player);
		console.info('Badges checked for player: ', player);
	}
	console.timeEnd();
	console.time();
	// Set game active state to false
	for (const game of endedActiveGames) {
		console.info('Deactivating game: ', game.id);
		await deactivateGame(game.id);
		console.info('Game deactivated: ', game.id);
	}
	console.timeEnd();
	return json({
		status: 'success',
		data: { playersChecked: uniquePlayers, gamesEnded: endedActiveGames.map((g) => g.id) }
	});
}
