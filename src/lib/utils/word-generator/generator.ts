import animals from './animals.json';
import encouragingWords from './encouraging-words.json';
import verbs from './verbs.json';
import { randomBytes } from 'crypto';

export const generateUniqueSentence = () => {
	const randomEncouragingWord = encouragingWords[Math.floor(rnd() * encouragingWords.length)];
	const randomAnimal = animals[Math.floor(rnd() * animals.length)];
	const randomVerb = verbs[Math.floor(rnd() * verbs.length)];
	const randomInt = Math.floor(rnd() * 1000 + 1);
	return `${randomEncouragingWord}-${randomVerb}-${randomAnimal}-${randomInt}`;
};

const rnd = () => {
	const buffer = randomBytes(8);
	return _intToFloat(parseInt(buffer.toString('hex'), 16));
};

function _intToFloat(integer: number) {
	return integer / Math.pow(2, 64);
}
