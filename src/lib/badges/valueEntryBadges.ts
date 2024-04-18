import { tryUnlockBadge } from '$lib/supabase/badges';

export const checkForValueEntryBadge = async (value: number, userId: string): Promise<number> => {
	if (!userId) return 0;

	let badgesUnlocked = 0;

	// Luck's Fickle Finger
	if (value === 1) {
		const res = await tryUnlockBadge('lucks-fickle-finger', userId);
		if (res.type === 'success' && res.data === 'unlocked') badgesUnlocked++;
	}

	// Cloud 99
	if (value === 69) {
		const res = await tryUnlockBadge('nice', userId);
		if (res.type === 'success' && res.data === 'unlocked') badgesUnlocked++;
	}

	// Nice
	if (value === 99) {
		const res = await tryUnlockBadge('cloud-99', userId);
		if (res.type === 'success' && res.data === 'unlocked') badgesUnlocked++;
	}

	// Triskaidekaphilia
	if (value === 13) {
		const res = await tryUnlockBadge('triskaidekaphilia', userId);
		if (res.type === 'success' && res.data === 'unlocked') badgesUnlocked++;
	}

	// The Answer
	if (value === 42) {
		const res = await tryUnlockBadge('the-answer', userId);
		if (res.type === 'success' && res.data === 'unlocked') badgesUnlocked++;
	}

	// What Are The Odds
	if (checkForWhatAreTheOddsBadge(value)) {
		const res = await tryUnlockBadge('what-are-the-odds', userId);
		if (res.type === 'success' && res.data === 'unlocked') badgesUnlocked++;
	}

	const osloHour = getOsloHour();

	// Early Bird
	if (osloHour >= 4 && osloHour < 7) {
		const res = await tryUnlockBadge('early-bird', userId);
		if (res.type === 'success' && res.data === 'unlocked') badgesUnlocked++;
	}

	// Night Owl
	if (osloHour < 4) {
		const res = await tryUnlockBadge('night-owl', userId);
		if (res.type === 'success' && res.data === 'unlocked') badgesUnlocked++;
	}

	return badgesUnlocked;
};

// Check if value is equal to the value of the current hour, minute, or second
const checkForWhatAreTheOddsBadge = (value: number) => {
	if (value > 60) return false;
	const now = new Date();
	const hour = now.getUTCHours();
	const minute = now.getUTCMinutes();
	const second = now.getUTCSeconds();
	return value === hour || value === minute || value === second;
};

function getOsloHour() {
	const now = new Date();
	const osloTimeString = now.toLocaleString('en-US', { timeZone: 'Europe/Oslo', hour12: false });
	const hour = new Date(osloTimeString).getHours();
	return hour;
}
