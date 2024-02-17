export function formatTimeDelta(deltaMilliseconds: number): string {
	let delta = Math.abs(deltaMilliseconds) / 1000; // Convert milliseconds to seconds

	const days = Math.floor(delta / 86400);
	delta -= days * 86400;

	const hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	const minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;

	const seconds = Math.floor(delta % 60);

	let result = '';
	if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
	if (hours > 0 || days > 0) result += `${hours} hour${hours > 1 ? 's' : ''}, `;
	if (minutes > 0 || hours > 0 || days > 0)
		result += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
	result += `${seconds} second${seconds > 1 ? 's' : ''}`;

	return result.trimEnd().replace(/,\s*$/, '');
}
