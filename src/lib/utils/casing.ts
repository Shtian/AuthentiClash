// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Casing = {
	Lower: 'lower',
	Upper: 'upper',
	Snake: 'snake',
	Pascal: 'pascal',
	Kebab: 'kebab',
	Capitalize: 'capitalize',
	CapitalizeAll: 'capitalize-all',
	Camel: 'camel',
	Clap: 'clap'
} as const;

export type CasingType = (typeof Casing)[keyof typeof Casing];

export function toCasing(type: CasingType, str: string) {
	switch (type) {
		case 'lower':
			return str.toLowerCase();
		case 'upper':
			return str.toUpperCase();
		case 'snake':
			return str.toLowerCase().replace(/\s/g, '_');
		case 'pascal':
			return str
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join('');
		case 'kebab':
			return str.toLowerCase().replace(/\s/g, '-');
		case 'capitalize':
			return str.charAt(0).toUpperCase() + str.slice(1);
		case 'capitalize-all':
			return str
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		case 'clap':
			return str
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')
				.replace(/ /g, '👏');
		case 'camel':
			return str
				.toLowerCase()
				.split(' ')
				.map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
				.join('');
		default:
			return str;
	}
}

function createCasingFunction(type: CasingType) {
	return function (strings: TemplateStringsArray, ...values: unknown[]): string {
		const result = strings.map((str, i) => str + (values[i] || '')).join('');
		return toCasing(type, result);
	};
}

export const pascalCase = createCasingFunction('pascal');
export const kebabCase = createCasingFunction('kebab');
export const snakeCase = createCasingFunction('snake');
export const camelCase = createCasingFunction('camel');
export const clapCase = createCasingFunction('clap');
export const capitalize = createCasingFunction('capitalize');
export const capitalizeAll = createCasingFunction('capitalize-all');
export const lowerCase = createCasingFunction('lower');
export const upperCase = createCasingFunction('upper');
