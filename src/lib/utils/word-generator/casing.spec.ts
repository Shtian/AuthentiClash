import { toCasing } from './casing';
import { describe, it, expect } from 'vitest';

describe('toCorrectCasing', () => {
	it('should convert string to lowercase', () => {
		const str = 'this is a long sentence';
		const result = toCasing('lower', str);
		expect(result).toBe('this is a long sentence');
	});

	it('should convert string to uppercase', () => {
		const str = 'loud noises';
		const result = toCasing('upper', str);
		expect(result).toBe('LOUD NOISES');
	});

	it('should convert string to snake case', () => {
		const str = 'this is a long sentence';
		const result = toCasing('snake', str);
		expect(result).toBe('this_is_a_long_sentence');
	});

	it('should convert string to pascal case', () => {
		const str = 'This is a long sentence';
		const result = toCasing('pascal', str);
		expect(result).toBe('ThisIsALongSentence');
	});

	it('should convert string to kebab case', () => {
		const str = 'This is a long sentence';
		const result = toCasing('kebab', str);
		expect(result).toBe('this-is-a-long-sentence');
	});

	it('should capitalize the first letter of the string', () => {
		const str = 'this is a long sentence';
		const result = toCasing('capitalize', str);
		expect(result).toBe('This is a long sentence');
	});

	it('should capitalize the first letter of each word in the string', () => {
		const str = 'This is a long sentence';
		const result = toCasing('capitalize-all', str);
		expect(result).toBe('This Is A Long Sentence');
	});

	it('should return the string as is for unknown casing type', () => {
		const str = 'This is a long sentence';
		// @ts-expect-error testing unknown casing type
		const result = toCasing('unknown', str);
		expect(result).toBe('This is a long sentence');
	});

	it('should replace spaces with clap emoji', () => {
		const str = 'This is a long sentence';
		const result = toCasing('clap', str);
		expect(result).toBe('This👏Is👏A👏Long👏Sentence');
	});

	it('should convert string to camel case', () => {
		const str = 'This is a long sentence';
		const result = toCasing('camel', str);
		expect(result).toBe('thisIsALongSentence');
	});
});
