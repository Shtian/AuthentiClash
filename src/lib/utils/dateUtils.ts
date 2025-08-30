// Format time detalta in human readable format
export function formatTimeDelta(deltaMilliseconds: number): string {
	const [days, hours, minutes, seconds] = timeLeft(deltaMilliseconds);

	let result = '';
	if (days > 0) result += `${leftPad(days, 2)}d `;
	if (hours > 0 || days > 0) result += `${leftPad(hours, 2)}h `;
	if (minutes > 0 || hours > 0 || days > 0) result += `${leftPad(minutes, 2)}m `;
	result += `${leftPad(seconds, 2)}s`;

	return result.trimEnd().replace(/,\s*$/, '');
}

// Format time delta in HH:MM:SS format
export function formatTimeDeltaShort(deltaMilliseconds: number): string {
	const [days, hours, minutes, seconds] = timeLeft(deltaMilliseconds);
	let result = '';
	if (days > 0) result += `${leftPad(days, 2)}:`;
	if (hours > 0 || days > 0) result += `${leftPad(hours, 2)}:`;
	if (minutes > 0 || hours > 0 || days > 0) result += `${leftPad(minutes, 2)}:`;
	result += `${leftPad(seconds, 2)}`;

	return result;
}

function leftPad(num: number, length: number): string {
	return num.toString().padStart(length, '0');
}

function timeLeft(deltaMilliseconds: number): [number, number, number, number] {
	let delta = Math.abs(deltaMilliseconds) / 1000; // Convert milliseconds to seconds

	const days = Math.floor(delta / 86400);
	delta -= days * 86400;

	const hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	const minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;

	const seconds = Math.floor(delta % 60);

	return [days, hours, minutes, seconds];
}

export function timeUntilCooldownEnds(lastUpdatedISO: string | null, cooldownHours: number) {
	if (!lastUpdatedISO) return 0;
	const now = new Date();
	const lastUpdated = new Date(lastUpdatedISO);

	// Calculate the time difference in milliseconds
	const timeDifferenceMillis = now.getTime() - lastUpdated.getTime();

	// Calculate the remaining time until cooldown ends
	const remainingTimeMillis = cooldownHours * 60 * 60 * 1000 - timeDifferenceMillis;

	return Math.max(0, remainingTimeMillis);
}

// Returns true if both dates are on the same UTC calendar day
export function isSameUtcDay(a: Date, b: Date): boolean {
	return (
		a.getUTCFullYear() === b.getUTCFullYear() &&
		a.getUTCMonth() === b.getUTCMonth() &&
		a.getUTCDate() === b.getUTCDate()
	);
}

// Milliseconds until the next UTC midnight from the given date (default: now)
export function msUntilNextUtcMidnight(from: Date = new Date()): number {
	const next = new Date(
		Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + 1, 0, 0, 0, 0)
	);
	return Math.max(0, next.getTime() - from.getTime());
}

// Daily cooldown helper: 0 if last update wasn't today (UTC) or null; otherwise ms until next UTC midnight
export function timeUntilDailyCooldownEnds(lastUpdatedISO: string | null): number {
	if (!lastUpdatedISO) return 0;
	const lastUpdated = new Date(lastUpdatedISO);
	const now = new Date();
	if (!isSameUtcDay(lastUpdated, now)) return 0;
	return msUntilNextUtcMidnight(now);
}
