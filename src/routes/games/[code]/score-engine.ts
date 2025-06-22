import { ABILITIES, PROTECTORS_OATH_PERCENTAGE } from '$lib/classes/abilities';
import { CLASSES } from '$lib/classes/classes';
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

type PassiveAbilityResult = {
	newScore: number;
	description: string;
	modified: boolean;
};

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
	const {
		newScore: scoreAfterPassives,
		description,
		modified
	} = runPassiveAbilities(score, userParticipation);
	const updateParticipationRes = await updateParticipationScore(
		scoreAfterPassives,
		userParticipation
	);

	if (updateParticipationRes.type === 'error') {
		console.error('Error updating score: ', JSON.stringify(updateParticipationRes.error));
		return {
			type: 'error',
			data: null,
			error: { message: 'Oh no, something went wrong. Please try again. 🙏' }
		};
	}

	const scoreText = description ? `, ${description}` : '';
	const gameLogRes = await addGameLogWithAI(
		gameId,
		modified
			? `${userParticipation.nickname} scored ${score}${scoreText}, final score: ${scoreAfterPassives}`
			: `${userParticipation.nickname} scored ${scoreAfterPassives}`
	);
	const message =
		gameLogRes.type === 'success' && gameLogRes.data
			? gameLogRes.data.text_ai || gameLogRes.data.text
			: '';

	return {
		type: 'success',
		data: { newScore: scoreAfterPassives, message },
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
		case ABILITIES.FINAL_WAGER:
			return runFinalWagerAbility(score, userParticipation);
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

	if (target.profileId === userParticipation.profileId) {
		return {
			type: 'error',
			data: null,
			error: { message: 'Cutpurse cannot be used on yourself!' }
		};
	}

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
 * Final Wager: 50% chance to gain +50 pts, otherwise lose 50 pts.
 */
const runFinalWagerAbility = async (
	score: number,
	userParticipation: Participation
): Promise<Response<Success>> => {
	const newScore = Math.random() < 0.5 ? score + 50 : score - 50;

	const updateParticipationRes = await updateParticipationScore(newScore, userParticipation, true);

	if (updateParticipationRes.type === 'error') {
		console.error('Error updating score: ', JSON.stringify(updateParticipationRes));
		return {
			type: 'error',
			error: { message: 'Oh no, something went wrong. 🙏' },
			data: null
		};
	}

	const scoreDiff = newScore - score;
	const message =
		scoreDiff > 0
			? `${userParticipation.nickname} activated Final Wager and gained 50 points, making their score ${newScore}! 💰`
			: `${userParticipation.nickname} activated Final Wager and lost 50 points, making their score ${newScore}! 😱`;
	await addGameLogWithAI(userParticipation.gameId, message);

	return {
		type: 'success',
		data: { newScore, message },
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

function runFatefulFlickAbility(score: number): PassiveAbilityResult {
	// 33% chance to gain +10 pts, otherwise lose 5 pts.
	const random = Math.random();
	if (random < 0.33) {
		return {
			newScore: score + 10,
			description: 'Fateful Flick increased score by 10',
			modified: true
		};
	} else {
		return {
			newScore: score - 5,
			description: 'Fateful Flick decreased score by 5',
			modified: true
		};
	}
}

function runPassiveAbilities(
	score: number,
	userParticipation: Participation
): PassiveAbilityResult {
	if (userParticipation.classId === CLASSES.DICEBLADE) {
		return runFatefulFlickAbility(score);
	}

	return { newScore: score, description: '', modified: false };
}
