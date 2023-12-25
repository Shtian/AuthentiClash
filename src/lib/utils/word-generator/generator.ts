import animals from './creatures.json';
import encouragingWords from './encouraging-words.json';
import verbs from './verbs.json';

export const generateNickName = () => {
	const randomAnimal = animals[Math.floor(rnd() * animals.length)];
	const randomVerb = verbs[Math.floor(rnd() * verbs.length)];
	const nickname = `${randomVerb} ${randomAnimal}`;
	return nickname;
};

export const generateUniqueSentence = () => {
	const randomEncouragingWord = encouragingWords[Math.floor(rnd() * encouragingWords.length)];
	const randomAnimal = animals[Math.floor(rnd() * animals.length)];
	const randomVerb = verbs[Math.floor(rnd() * verbs.length)];
	const randomInt = Math.floor(rnd() * 1000 + 1);
	return `${randomEncouragingWord} ${randomVerb} ${randomAnimal} ${randomInt}`;
};

const rnd = () => {
	return Math.random();
};
