import { fictionalCreatures, nonFictionalCreatures } from './creatures';
import encouragingWords from './encouraging-words.json';
import verbs from './verbs.json';
import descriptors from './descriptors.json';

const allCreatures = [...nonFictionalCreatures, ...fictionalCreatures];

export const generateNickName = () => {
	const randomAnimal = allCreatures[Math.floor(rnd() * allCreatures.length)];
	const randomDescriptor = descriptors[Math.floor(rnd() * descriptors.length)];
	const nickname = `${randomDescriptor} ${randomAnimal}`;
	return nickname;
};

export const generateUniqueSentence = () => {
	const randomEncouragingWord = encouragingWords[Math.floor(rnd() * encouragingWords.length)];
	const randomAnimal = allCreatures[Math.floor(rnd() * allCreatures.length)];
	const randomVerb = verbs[Math.floor(rnd() * verbs.length)];
	const randomInt = Math.floor(rnd() * 1000 + 1);
	return `${randomEncouragingWord} ${randomVerb} ${randomAnimal} ${randomInt}`;
};

const rnd = () => {
	return Math.random();
};
