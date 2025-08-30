import { ABILITIES } from '$lib/classes/abilities';
import { getGameParticipations } from '$lib/supabase/participation';
import { tryUnlockBadge } from '$lib/supabase/badges';

/**
 * Checks and unlocks badges tied to ability usage.
 * Returns the number of badges newly unlocked in this check (0 or more).
 */
export const checkForAbilityBadge = async (
	abilityId: string | null,
	userId: string,
	gameId: string
): Promise<number> => {
	if (!userId || !abilityId) return 0;

	const id = parseInt(abilityId, 10);

	// Paladin: Judgment Day — used Judgment with 5+ opponents ahead
	if (id === ABILITIES.JUDGMENT) {
		const res = await getGameParticipations(gameId);
		if (res.type === 'error') return 0;

		const me = res.data.find((p) => p.profileId === userId);
		if (!me) return 0;

		// Only count players with at least one entered score
		const ahead = res.data.filter(
			(p) => p.profileId !== userId && p.score && p.score.length > 0 && p.totalScore > me.totalScore
		).length;
		if (ahead >= 5) {
			const unlockRes = await tryUnlockBadge('judgment-day', userId);
			if (unlockRes.type === 'success' && unlockRes.data === 'unlocked') return 1;
		}
	}

	return 0;
};
