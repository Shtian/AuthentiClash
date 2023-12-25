import { describe, it, expect } from 'vitest';
import { generateNickName, generateUniqueSentence } from './generator';

describe('generateUniqueSentence', () => {
	it('should generate a unique sentence', () => {
		const sentence = generateUniqueSentence();
		expect(typeof sentence).toBe('string');
		expect(sentence.length).toBeGreaterThan(0);
	});
});

describe('generateNickName', () => {
	it('should generate a nickname with a capitalized verb and animal', () => {
		const nickname = generateNickName();
		const [verb, animal] = nickname.split(' ');
		expect(verb.charAt(0)).toBe(verb.charAt(0).toUpperCase());
		expect(animal.charAt(0)).toBe(animal.charAt(0).toUpperCase());
	});
});

describe('generateUniqueSentence', () => {
	it('should generate a unique sentence', () => {
		const sentence = generateUniqueSentence();
		expect(typeof sentence).toBe('string');
		expect(sentence.length).toBeGreaterThan(0);
	});
});

describe('generateNickName', () => {
	it('should generate a nickname with a capitalized verb and animal', () => {
		const nickname = generateNickName();
		const [verb, animal] = nickname.split(' ');
		expect(verb.charAt(0)).toBe(verb.charAt(0).toUpperCase());
		expect(animal.charAt(0)).toBe(animal.charAt(0).toUpperCase());
	});
});
