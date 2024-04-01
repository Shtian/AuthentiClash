import { checkForRankingBadge } from '$lib/badges/gameRankingBadges';
import { deactivateGame, getEndedActiveGames } from '$lib/supabase/games';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	// get all games that are active
	const endedActiveGamesRes = await getEndedActiveGames();
	if (endedActiveGamesRes.type === 'error') {
		return error(500, { message: endedActiveGamesRes.error.message });
	}
	const endedActiveGames = endedActiveGamesRes.data;

	// Get all players that have participated
	const players = endedActiveGames.flatMap((game) => game.participation);
	const uniquePlayers = [...new Set(players)];

	// Run a badge check for each player
	for (const player of uniquePlayers) {
		await checkForRankingBadge(player);
	}

	// Set game active state to false
	for (const game of endedActiveGames) {
		await deactivateGame(game.id);
	}

	return json({ status: 'success', data: uniquePlayers });
}
