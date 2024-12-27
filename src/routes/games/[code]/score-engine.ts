import { ABILITIES } from '$lib/classes/abilities';
import { giveOtherPlayerScore } from '$lib/supabase/abilities/attacks';
import { addGameLog } from '$lib/supabase/gameLog';
import {
	getGameParticipations,
	getParticipation,
	updateParticipationScore,
	type Participation
} from '$lib/supabase/participation';

export type Response<T> =
	| { type: 'success'; data: T; error: null }
	| { type: 'error'; data: null; error: { message: string } };

type Success = { newScore: number; message: string };

export const handleScoreUpdate = async (
	score: number,
	userId: string,
	gameId: string,
	abilityId: string | null
): Promise<Response<Success>> => {
	if (!abilityId) {
		return await tryUpdateParticipationScore(score, userId, gameId);
	}

	return await runAbilityCalculations(score, userId, gameId, parseInt(abilityId, 10));
};

const tryUpdateParticipationScore = async (
	score: number,
	userId: string,
	gameId: string
): Promise<Response<Success>> => {
	const res = await getParticipation(userId, gameId);
	if (res.type === 'error') {
		console.error('Error updating score: ', JSON.stringify(res.error));
		return {
			type: 'error',
			data: null,
			error: { message: 'Oh no, something went wrong. Please try again. 🙏' }
		};
	}
	const userParticipation = res.data;
	const updateParticipationRes = await updateParticipationScore(score, userParticipation);

	if (updateParticipationRes.type === 'error') {
		console.error('Error updating score: ', JSON.stringify(updateParticipationRes.error));
		return {
			type: 'error',
			data: null,
			error: { message: 'Oh no, something went wrong. Please try again. 🙏' }
		};
	}

	await addGameLog(gameId, `${userParticipation.nickname} scored ${score}`, '');

	return {
		type: 'success',
		data: { newScore: score, message: '' },
		error: null
	};
};

const runAbilityCalculations = async (
	score: number,
	userId: string,
	gameId: string,
	abilityId: number
): Promise<Response<Success>> => {
	const res = await getParticipation(userId, gameId);
	if (res.type === 'error') {
		console.error('Error getting participation: ', JSON.stringify(res));
		return {
			type: 'error',
			data: null,
			error: { message: 'Oh no, something went wrong. Please try again. 🙏' }
		};
	}

	const userParticipation = res.data;
	if (userParticipation.abilityUsed) {
		return {
			type: 'error',
			data: null,
			error: { message: 'You have already used your ability!' }
		};
	}

	switch (abilityId) {
		case ABILITIES.CUTPURSE:
			return runCutpurseAbility(score, userParticipation);
		case ABILITIES.CRIMSON_REAP:
			return runCrimsonReapAbility(score, userParticipation);
		case ABILITIES.INFERNAL_RAGE:
			return runInfernalRageAbility(score, userParticipation);
		default:
			return {
				type: 'error',
				data: null,
				error: { message: `Unknown ability id: ${abilityId}` }
			};
	}
};

/**
 * Steals 20-40 points to the other player with the highest total score.
 * Other players need to be in the positive.
 * Cannot steal more than total score
 * @param score
 * @param userParticipation
 * @returns
 */
const runCutpurseAbility = async (
	score: number,
	userParticipation: Participation
): Promise<Response<Success>> => {
	const res = await getGameParticipations(userParticipation.gameId);
	if (res.type === 'error') {
		console.error('Error getting participation: ', JSON.stringify(res));
		return {
			type: 'error',
			data: null,
			error: { message: 'Oh no, something went wrong. Please try again. 🙏' }
		};
	}

	// Other players WITH positive totalScore
	const otherParticipants = res.data.filter(
		(participation) =>
			participation.profileId !== userParticipation.profileId && participation.totalScore > 0
	);

	if (!otherParticipants.length) {
		return {
			type: 'error',
			data: null,
			error: { message: 'No valid targets for Cutpurse!' }
		};
	}

	const topPlayers = otherParticipants.toSorted((a, b) => b.totalScore - a.totalScore);
	const target = topPlayers[0];

	const attemptToSteal = Math.floor(Math.random() * 21) + 20;
	const stolen = Math.min(target.totalScore, attemptToSteal);
	await giveOtherPlayerScore(stolen * -1, target);

	const playerNewScore = Math.min(99, score + stolen);

	const updateParticipationRes = await updateParticipationScore(
		playerNewScore,
		userParticipation,
		true
	);

	if (updateParticipationRes.type === 'error') {
		console.error('Error updating score: ', JSON.stringify(updateParticipationRes));
		return {
			type: 'error',
			error: { message: 'Oh no, something went wrong. 🙏' },
			data: null
		};
	}

	await addGameLog(
		userParticipation.gameId,
		`${userParticipation.nickname} activated Cutpurse and stole ${stolen} points from ${target.nickname} 💰`,
		''
	);

	return {
		type: 'success',
		data: {
			newScore: playerNewScore,
			message: `Cutpurse stole ${stolen} points from ${target.nickname.replace(/\(.*\)/, '').trim()}! 💰`
		},
		error: null
	};
};

/**
 * Deals 10-20 damage to 5 random targets
 * @param score
 * @param userParticipation
 * @returns
 */
const runCrimsonReapAbility = async (
	score: number,
	userParticipation: Participation
): Promise<Response<Success>> => {
	const MAX_TARGETS = 5;

	const res = await getGameParticipations(userParticipation.gameId);
	if (res.type === 'error') {
		console.error('Error getting participation: ', JSON.stringify(res));
		return {
			type: 'error',
			data: null,
			error: { message: 'Oh no, something went wrong. Please try again. 🙏' }
		};
	}

	const otherParticipants = res.data.filter(
		(participation) => participation.profileId !== userParticipation.profileId
	);

	if (!otherParticipants.length) {
		return {
			type: 'error',
			data: null,
			error: { message: 'No valid targets for Crimson Reap!' }
		};
	}

	const targets: Participation[] = [];
	const numberOfTargets = Math.min(MAX_TARGETS, otherParticipants.length);
	for (let i = 0; i < numberOfTargets; i++) {
		const targetIndex = Math.floor(Math.random() * otherParticipants.length);
		targets.push(otherParticipants[targetIndex]);
		otherParticipants.splice(targetIndex, 1);
	}

	let totalDamage = 0;
	for (const target of targets) {
		const damage = Math.floor(Math.random() * 11) + 10;
		await giveOtherPlayerScore(damage * -1, target);
		totalDamage += damage;
	}

	const updateParticipationRes = await updateParticipationScore(score, userParticipation, true);

	if (updateParticipationRes.type === 'error') {
		console.error('Error updating score: ', JSON.stringify(updateParticipationRes));
		return {
			type: 'error',
			error: { message: 'Oh no, something went wrong. 🙏' },
			data: null
		};
	}
	const targetNames = targets.map((t) => t.nickname).join(', ');
	await addGameLog(
		userParticipation.gameId,
		`${userParticipation.nickname} activated Crimson Reap and hit ${targetNames} for a total of ${totalDamage} damage ☠️`,
		''
	);

	return {
		type: 'success',
		data: { newScore: score, message: `Crimson Reap dealt ${totalDamage} damage! ☠️` },
		error: null
	};
};

/**
 * Infernal Rage: Multiplies the score by 2 (max 99).
 */
const runInfernalRageAbility = async (
	score: number,
	userParticipation: Participation
): Promise<Response<Success>> => {
	const newScore = Math.min(99, score * 2);

	const updateParticipationRes = await updateParticipationScore(newScore, userParticipation, true);

	if (updateParticipationRes.type === 'error') {
		console.error('Error updating score: ', JSON.stringify(updateParticipationRes));
		return {
			type: 'error',
			error: { message: 'Oh no, something went wrong. 🙏' },
			data: null
		};
	}

	await addGameLog(
		userParticipation.gameId,
		`${userParticipation.nickname} activated Infernal Rage and scored ${newScore} 🔥`,
		''
	);

	return {
		type: 'success',
		data: { newScore, message: `Infernal Rage used, new score: ${newScore}! 🔥` },
		error: null
	};
};
