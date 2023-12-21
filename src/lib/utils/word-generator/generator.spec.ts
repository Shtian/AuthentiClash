import { describe, it, expect } from 'vitest';
import { generateUniqueSentence } from './generator';

describe('generateUniqueSentence', () => {
	it('should generate a unique sentence', () => {
		const sentence = generateUniqueSentence();
		expect(typeof sentence).toBe('string');
		expect(sentence.length).toBeGreaterThan(0);
	});
});
