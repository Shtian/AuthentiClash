export const ABILITIES = {
	CUTPURSE: 1,
	CRIMSON_REAP: 2,
	INFERNAL_RAGE: 3
} as const;

export const CLASSES = {
	THIEF: 1,
	NECROMANCER: 2,
	BARBARIAN: 3
} as const;

export const CLASSES_NAME: {
	[index: number]: string;
} = {
	[CLASSES.THIEF]: 'Thief',
	[CLASSES.NECROMANCER]: 'Necromancer',
	[CLASSES.BARBARIAN]: 'Barbarian'
};
