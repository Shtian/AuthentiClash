import { giveOtherPlayerScore } from '$lib/supabase/abilities/attacks';
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

const ABILITIES = {
	CUTPURSE: 1,
	CRIMSON_REAP: 2,
	INFERNAL_RAGE: 3
} as const;

export const handleScoreUpdate = async (
	score: number,
	userId: string,
	gameId: string,
	abilityId: string | null
): Promise<Response<Success>> => {
	console.log('handleScoreUpdate', score, userId, gameId, abilityId);
	if (!abilityId) {
		console.log('no ability id');
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

const runCutpurseAbility = async (score: number, userParticipation: Participation) => {
	console.log('runCutpurseAbility', score, userParticipation);
	// Get all _other_ participants with one or more scores
	// Select a random participant from the list
	// Get a random score from the target
	// Subtract the score from the target
	// Set the score of the current user to the target score stolen
	throw new Error('Not implemented');
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

	return {
		type: 'success',
		data: { newScore, message: `Infernal Rage used, new score: ${newScore}! 🔥` },
		error: null
	};
};
