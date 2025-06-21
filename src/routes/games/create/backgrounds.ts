type Background = {
	name: string;
	prompt: string;
};

export const predefinedBackgroundPrompts: Background[] = [
	{
		name: 'Random (default)',
		prompt: ''
	},
	{
		name: 'Cyberpunk Neon City',
		prompt:
			'neon-lit cyberpunk cityscape with holographic advertisements, flying cars, and glowing street signs'
	},
	{
		name: 'Enchanted Crystal Forest',
		prompt:
			'mystical forest with giant glowing crystals, floating sparkles, and bioluminescent mushrooms'
	},
	{
		name: 'Steampunk Airship',
		prompt:
			'brass and copper airship floating through clouds with steam-powered machinery and Victorian aesthetics'
	},
	{
		name: 'Underwater Atlantis',
		prompt:
			'crystal underwater palace with coral reefs, bioluminescent sea creatures, and ancient ruins'
	},
	{
		name: 'Volcanic Dragon Lair',
		prompt:
			'fiery volcanic cave with flowing lava, treasure hoards, and dragon scales scattered around'
	},
	{
		name: 'Floating Sky Islands',
		prompt: 'mystical floating islands connected by waterfalls, with gravity-defying architecture'
	},
	{
		name: 'Haunted Gothic Mansion',
		prompt: 'spooky gothic mansion with cobwebs, flickering candles, and supernatural mist'
	},
	{
		name: 'Space Station Zero',
		prompt:
			'futuristic space station with metallic corridors, star-filled views, and holographic displays'
	},
	{
		name: 'Time Portal Vortex',
		prompt:
			'swirling time portal with temporal distortions, floating clocks, and reality-bending energy'
	}
];
