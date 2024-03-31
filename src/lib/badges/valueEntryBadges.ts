import { tryUnlockBadge, type UnlockPlayerBadgeResponse } from '$lib/supabase/badges';

export const checkForValueEntryBadge = async (
	value: number,
	userId: string
): Promise<UnlockPlayerBadgeResponse> => {
	if (!userId) return 'not unlocked';

	// Luck's Fickle Finger
	if (value === 1) {
		const res = await tryUnlockBadge('lucks-fickle-finger', userId);
		if (res.type === 'success') return res.data;
		return 'not unlocked';
	}

	// Cloud 99
	if (value === 69) {
		const res = await tryUnlockBadge('nice', userId);
		if (res.type === 'success') return res.data;
		return 'not unlocked';
	}

	// Nice
	if (value === 99) {
		const res = await tryUnlockBadge('cloud-99', userId);
		if (res.type === 'success') return res.data;
		return 'not unlocked';
	}

	// What Are The Odds
	if (checkForWhatAreTheOddsBadge(value)) {
		const res = await tryUnlockBadge('what-are-the-odds', userId);
		if (res.type === 'success') return res.data;
		return 'not unlocked';
	}

	// No badge unlocked
	return 'not unlocked';
};

// check if value is equal to the value of the current hour, minute, or second
const checkForWhatAreTheOddsBadge = (value: number) => {
	if (value > 60) return false;
	const now = new Date();
	const hour = now.getUTCHours();
	const minute = now.getUTCMinutes();
	const second = now.getUTCSeconds();
	return value === hour || value === minute || value === second;
};
