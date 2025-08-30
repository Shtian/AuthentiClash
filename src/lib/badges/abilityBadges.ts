import { ABILITIES } from '$lib/classes/abilities';
import { type Participation } from '$lib/supabase/participation';
import { tryUnlockBadge } from '$lib/supabase/badges';

/**
 * Checks and unlocks badges tied to ability usage.
 * Returns the number of badges newly unlocked in this check (0 or more).
 */
export const checkForAbilityBadge = async (
	abilityId: string | null,
	userId: string,
	gameId: string,
	opts?: { preParticipation?: Participation; preParticipations?: Participation[] }
): Promise<number> => {
	if (!userId || !abilityId) return 0;

	const id = parseInt(abilityId, 10);

	// Paladin: Judgment Day — used Judgment with 5+ opponents ahead
	switch (id) {
		case ABILITIES.JUDGMENT:
			return checkJudgmentBadge(userId, opts);
	}

	return 0;
};

const checkJudgmentBadge = async (
	userId: string,
	opts?: { preParticipation?: Participation; preParticipations?: Participation[] }
) => {
	if (opts?.preParticipations === undefined || opts?.preParticipations.length <= 5) {
		return 0;
	}

	const list = opts.preParticipations;
	const me = opts.preParticipation ?? list.find((p) => p.profileId === userId);

	// Only count players with at least one entered score
	const ahead = list.filter((p) => p.profileId !== userId && p.totalScore > me!.totalScore).length;
	if (ahead >= 5) {
		const unlockRes = await tryUnlockBadge('judgment-day', userId);
		if (unlockRes.type === 'success' && unlockRes.data === 'unlocked') return 1;
	}

	return 0;
};
