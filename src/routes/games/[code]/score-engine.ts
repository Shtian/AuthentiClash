import { ABILITIES, PROTECTORS_OATH_PERCENTAGE } from '$lib/classes/abilities';
import { classMitigation, giveOtherPlayerScore } from '$lib/supabase/abilities/attacks';
import { addGameLogWithAI } from '$lib/supabase/gameLog';
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

	await addGameLogWithAI(gameId, `${userParticipation.nickname} scored ${score}`);

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
		case ABILITIES.PROTECTORS_OATH:
			return runProtectorsOathAbility(score, userParticipation);
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
	const attemptToSteal = Math.min(target.totalScore, Math.floor(Math.random() * 21) + 20);
	const stolen = classMitigation(attemptToSteal, target);
	await giveOtherPlayerScore(stolen * -1, target);

	const playerNewScore = Math.min(99, stolen + score);
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

	const playerStealText =
		stolen < attemptToSteal
			? `${userParticipation.nickname} attempted to steal ${attemptToSteal} points from ${target.nickname}, but ${attemptToSteal - stolen} points was blocked by ${target.nickname}, upping ${userParticipation.nickname}'s original 2FA entry from ${score} to ${playerNewScore} 💰`
			: `${userParticipation.nickname} activated Cutpurse and stole ${stolen} points from ${target.nickname}, upping ${userParticipation.nickname}'s original 2FA entry from ${score} to ${playerNewScore} 💰`;
	await addGameLogWithAI(userParticipation.gameId, playerStealText);

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
	let totalDamageMitigated = 0;
	for (const target of targets) {
		const damage = Math.floor(Math.random() * 11) + 10;
		const damageAfterMitigation = classMitigation(damage, target);
		await giveOtherPlayerScore(damageAfterMitigation * -1, target);
		totalDamage += damageAfterMitigation;
		totalDamageMitigated += damage - damageAfterMitigation;
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
	const mitigationText =
		totalDamageMitigated > 0
			? ` ${totalDamageMitigated} points were mitigated by one or more targets!`
			: '';
	await addGameLogWithAI(
		userParticipation.gameId,
		`${userParticipation.nickname} activated Crimson Reap and hit ${targetNames} for a total of ${totalDamage} damage ☠️${mitigationText}`
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

	await addGameLogWithAI(
		userParticipation.gameId,
		`${userParticipation.nickname} activated Infernal Rage increased their score from ${score} to ${newScore} 🔥`
	);

	return {
		type: 'success',
		data: { newScore, message: `Infernal Rage used, new score: ${newScore}! 🔥` },
		error: null
	};
};

/**
 * Heal the last player for 30-40 points and get 25% back
 */
const runProtectorsOathAbility = async (
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

	// sort participations by totalScore and get player in last position
	const sortedParticipations = res.data.sort((a, b) => b.totalScore - a.totalScore);
	const lastPlayer = sortedParticipations.at(-1);
	if (!lastPlayer || lastPlayer.profileId === userParticipation.profileId) {
		return {
			type: 'error',
			data: null,
			error: { message: "Protector's Oath cannot be used on yourself!" }
		};
	}

	const healAmount = Math.floor(Math.random() * 11) + 30;
	await giveOtherPlayerScore(healAmount, lastPlayer);

	const protectorsOathSelfHeal = Math.ceil(healAmount * PROTECTORS_OATH_PERCENTAGE);
	const playerNewScore = Math.min(99, protectorsOathSelfHeal + score);
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

	await addGameLogWithAI(
		userParticipation.gameId,
		`${userParticipation.nickname} healed ${lastPlayer.nickname} with Protector's Oath for ${healAmount} points, upping ${userParticipation.nickname}'s original 2FA entry from ${score} to ${playerNewScore}!`
	);

	return {
		type: 'success',
		data: {
			newScore: playerNewScore,
			message: `You healed ${lastPlayer.nickname} for ${healAmount} points, and got ${protectorsOathSelfHeal} points back!`
		},
		error: null
	};
};
