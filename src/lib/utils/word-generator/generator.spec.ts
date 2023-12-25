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
	it('should generate a nickname with a verb and animal', () => {
		const nickname = generateNickName();
		const [verb, animal] = nickname.split(' ');
		expect(verb).not.toBeNull();
		expect(animal).not.toBeNull();
	});
});

describe('generateUniqueSentence', () => {
	it('should generate a unique sentence with 3 words and a number', () => {
		const sentence = generateUniqueSentence();
		const [word1, word2, word3, number] = sentence.split(' ');
		expect(word1).not.toBeNull();
		expect(word2).not.toBeNull();
		expect(word3).not.toBeNull();
		expect(number).not.toBeNull();
		expect(Number(number)).not.toBe(NaN);
	});
});
