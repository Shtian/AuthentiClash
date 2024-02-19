// Format time detalta in human readable format
export function formatTimeDelta(deltaMilliseconds: number): string {
	const [days, hours, minutes, seconds] = timeLeft(deltaMilliseconds);

	let result = '';
	if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
	if (hours > 0 || days > 0) result += `${hours} hour${hours > 1 ? 's' : ''}, `;
	if (minutes > 0 || hours > 0 || days > 0)
		result += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
	result += `${seconds} second${seconds > 1 ? 's' : ''}`;

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
