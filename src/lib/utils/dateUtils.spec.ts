import { describe, it, expect } from 'vitest';
import { timeUntilCooldownEnds } from './dateUtils';

describe('timeUntilCooldownEnds', () => {
	it('should return 0 if lastUpdatedISO is not provided', () => {
		const result = timeUntilCooldownEnds('', 1);
		expect(result).toBe(0);
	});

	it('should return 0 if cooldown has ended', () => {
		const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
		const result = timeUntilCooldownEnds(twoHoursAgo, 1);
		expect(result).toBe(0);
	});

	it('should return remaining time in milliseconds if cooldown has not ended', () => {
		const halfAnHourAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
		const result = timeUntilCooldownEnds(halfAnHourAgo, 1);
		expect(result).toBeCloseTo(30 * 60 * 1000, -2);
	});
});
