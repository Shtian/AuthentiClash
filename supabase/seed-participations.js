import { createClient } from '@supabase/supabase-js';

console.log('⚙️ Seeding participations...');

const supabase = createClient(
	process.env.PUBLIC_SUPABASE_URL,
	process.env.PUBLIC_SUPABASE_ANON_KEY
);

const createSetOfScores = (length) => {
	const scores = [];
	for (let i = 0; i < length; i++) {
		scores.push(Math.floor(Math.random() * 99) + 1);
	}
	return scores;
};

const addParticipation = async (gameId, userId, nickname, scores, nickname_image_url, endTime) => {
	const referenceDate =
		new Date(endTime).getTime() > new Date().getTime() ? new Date() : new Date(endTime);
	const created_at = new Date(new Date(referenceDate).setUTCHours(-24));
	const updated_at = new Date(new Date(referenceDate).setUTCHours(-2));

	const participationData = {
		nickname,
		score: [...scores],
		total_score: scores.reduce((acc, score) => acc + score, 0),
		profile_id: userId,
		game_id: gameId,
		nickname_image_url,
		created_at,
		updated_at
	};

	const { error } = await supabase
		.from('participation')
		.insert(participationData)
		.select()
		.single();

	if (error) {
		console.error(error);
	}
};

const { data: games, error: gamesError } = await supabase
	.from('games')
	.select('id, creator, code, end_at, name');
if (gamesError) {
	console.error(gamesError);
}

const { data: users, error: usersError } = await supabase
	.from('profiles')
	.select('id, username, avatar_url');

if (usersError) {
	console.error(gamesError);
}

for (const game of games) {
	// Add participation for the creator
	const creator = users.find((user) => user.id === game.creator);
	const scoresPerPlayer = Math.floor(Math.random() * 5) + 1;
	const scores = createSetOfScores(scoresPerPlayer);
	await addParticipation(
		game.id,
		creator.id,
		creator.username,
		scores,
		creator.avatar_url,
		game.end_at
	);

	// Add participation for other players
	const otherPlayers = users.filter((user) => user.id !== creator.id);
	const numberOfOtherPlayers = Math.floor(Math.random() * otherPlayers.length);

	// unique list of other players selected randomly
	const generateListOfRandomPlayers = (players, count) => {
		const selectedPlayers = new Set();
		while (selectedPlayers.size < count) {
			const randomPlayer = players[Math.floor(Math.random() * players.length)];
			selectedPlayers.add(randomPlayer);
		}
		return selectedPlayers;
	};
	const selectedPlayers = generateListOfRandomPlayers(otherPlayers, numberOfOtherPlayers);

	// Add participation for all other players
	for (const player of selectedPlayers) {
		const scores = createSetOfScores(scoresPerPlayer);
		await addParticipation(
			game.id,
			player.id,
			player.username,
			scores,
			player.avatar_url,
			game.end_at
		);
	}

	console.log(
		`✔︎ Game ${game.name}: ${
			numberOfOtherPlayers + 1
		} players, ${scoresPerPlayer} scores per player`
	);
}

console.log(`Database seeded with ${games.length} games and ${users.length} users.`);
console.log(
	`login with the following credentials: user{1-${users.length}}@example.com / password123`
);
