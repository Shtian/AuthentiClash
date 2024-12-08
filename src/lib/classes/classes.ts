export const CLASSES = {
	THIEF: 1,
	BARBARIAN: 3,
	NECROMANCER: 2
} as const;

export const CLASSES_NAME: {
	[index: number]: string;
} = {
	[CLASSES.THIEF]: 'Thief',
	[CLASSES.BARBARIAN]: 'Barbarian',
	[CLASSES.NECROMANCER]: 'Necromancer'
};

export function getClassName(classId: number) {
	return CLASSES_NAME[classId];
}
