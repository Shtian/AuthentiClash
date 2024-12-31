export const ABILITIES = {
	CUTPURSE: 1,
	CRIMSON_REAP: 2,
	INFERNAL_RAGE: 3,
	DIVINE_AEGIS: 4,
	PROTECTORS_OATH: 5
} as const;

export const CLASSES = {
	THIEF: 1,
	NECROMANCER: 2,
	BARBARIAN: 3,
	PALADIN: 4,
	WARDEN: 5
} as const;

export const CLASSES_NAME: {
	[index: number]: string;
} = {
	[CLASSES.THIEF]: 'Thief',
	[CLASSES.NECROMANCER]: 'Necromancer',
	[CLASSES.BARBARIAN]: 'Barbarian',
	[CLASSES.PALADIN]: 'Paladin',
	[CLASSES.WARDEN]: 'Warden'
};

export const DIVINE_AEGIS_PERCENTAGE = 0.75;
export const PROTECTORS_OATH_PERCENTAGE = 0.25;
