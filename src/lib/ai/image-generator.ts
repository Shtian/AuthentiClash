import { FAL_KEY, OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import backdrops from './backdrops.json';
import { fal } from '@fal-ai/client';

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || OPENAI_API_KEY });
fal.config({ credentials: process.env.FAL_KEY || FAL_KEY });

const openaiImageModel: 'gpt-image-1-mini' | 'gpt-image-1' = 'gpt-image-1-mini';

export async function generateImageFal(
	username: string,
	backgroundPrompt?: string
): Promise<string | undefined> {
	try {
		const prompt = createImagePrompt(username, backgroundPrompt);
		const result = await fal.subscribe('fal-ai/flux/dev', {
			input: {
				prompt,
				image_size: 'square_hd',
				num_images: 1,
				enable_safety_checker: false
			},
			logs: true
		});

		console.log('Avatar gen prompt:', prompt);
		console.log('Avatar result', result.data);
		console.log('Avatar request id', result.requestId);

		const falCdnUrl = result.data.images?.[0]?.url;
		if (!falCdnUrl) {
			console.error('No URL in fal-ai response');
			return undefined;
		}

		return falCdnUrl;
	} catch (error) {
		console.error('Error generating image with fal-ai: ', error);
		return undefined;
	}
}

export async function generateImage(
	username: string,
	backgroundPrompt?: string
): Promise<string | undefined> {
	try {
		const prompt = createImagePrompt(username, backgroundPrompt);
		console.log(`Generating image with ${openaiImageModel}, prompt: `, prompt);
		const image = await openaiClient.images.generate({
			model: openaiImageModel,
			size: '1024x1024',
			prompt
		});

		const b64 = image.data?.[0]?.b64_json;
		if (!b64) {
			console.error('No b64 image data returned from OpenAI');
			return undefined;
		}
		return b64;
	} catch (error) {
		console.error('Error generating image with gpt-image-1: ', error);
		return undefined;
	}
}

export async function generateEndgameImage(
	winnerName: string,
	competitors: string[],
	backgroundPrompt?: string
): Promise<string | undefined> {
	try {
		const prompt = createEndgameImagePrompt(winnerName, competitors, backgroundPrompt);
		console.log('Generating endgame image with prompt: ', prompt);
		const image = await openaiClient.images.generate({
			quality: 'standard',
			model: 'dall-e-3',
			size: '1024x1024',
			n: 1,
			response_format: 'url',
			prompt
		});

		if (!image.data) {
			console.error('No image data returned from OpenAI for endgame image');
			return undefined;
		}

		console.log('Endgame revised image prompt: ', image.data[0]?.revised_prompt);
		console.log('Endgame image URL: ', image.data[0]?.url);
		return image.data[0].url;
	} catch (error) {
		console.error('Error generating endgame image: ', error);
		return undefined;
	}
}

export async function generateEndgameImageFal(
	winnerName: string,
	competitors: string[],
	backgroundPrompt?: string
): Promise<string | undefined> {
	try {
		const prompt = createEndgameImagePrompt(winnerName, competitors, backgroundPrompt);
		const result = await fal.subscribe('fal-ai/flux/dev', {
			input: {
				prompt,
				image_size: 'square_hd',
				num_images: 1,
				enable_safety_checker: false
			},
			logs: true
		});

		console.log('Endgame image gen prompt:', prompt);
		console.log('Endgame image result', result.data);
		console.log('Endgame image request id', result.requestId);

		const falCdnUrl = result.data.images?.[0]?.url;
		if (!falCdnUrl) {
			console.error('No URL in fal-ai response for endgame image');
			return undefined;
		}

		return falCdnUrl;
	} catch (error) {
		console.error('Error generating endgame image with fal:', error);
		return undefined;
	}
}

export async function generateEndgameImageB64(
	winnerName: string,
	competitors: string[],
	backgroundPrompt?: string
): Promise<string | undefined> {
	try {
		const prompt = createEndgameImagePrompt(winnerName, competitors, backgroundPrompt);
		console.log(`Generating image with ${openaiImageModel}, prompt: `, prompt);
		const image = await openaiClient.images.generate({
			model: openaiImageModel,
			size: '1024x1024',
			prompt
		});

		const b64 = image.data?.[0]?.b64_json;
		if (!b64) {
			console.error('No b64 image data returned from OpenAI for endgame image');
			return undefined;
		}
		return b64;
	} catch (error) {
		console.error('Error generating endgame image with gpt-image-1: ', error);
		return undefined;
	}
}

function createImagePrompt(username: string, backgroundPrompt?: string) {
	const nameStrippedOfParentheses = username.replace(/\(.*\)/, '').trim();
	const [descriptor, creature = nameStrippedOfParentheses] = nameStrippedOfParentheses.split(' ');

	// Use provided background prompt if available, otherwise use random backdrop
	const backdrop = backgroundPrompt || backdrops[Math.floor(Math.random() * backdrops.length)];

	return `Create an image of a ${descriptor} ${creature}, with the background theme of "${backdrop}".`;
}

function createEndgameImagePrompt(
	winnerName: string,
	competitors: string[],
	backgroundPrompt?: string
) {
	const clean = (name: string) => name.replace(/\(.*\)/, '').trim();

	const winner = clean(winnerName);
	const others = competitors.map(clean).filter((n) => n && n !== winner);

	// Reframe opponents as emblems/banners (non-living)
	const opponentNouns = others.length
		? `, standing triumphant as champion before ${others.join(', ')}`
		: ', standing triumphant as champion';

	const backdrop = backgroundPrompt || backdrops[Math.floor(Math.random() * backdrops.length)];

	return `Create an epic, high-detail, cinematic image of ${winner}${opponentNouns}. Background theme: "${backdrop}".`;
}

// Wrapper functions that dispatch to the correct provider based on IMAGE_GENERATOR env variable
const imageGenerator = (process.env.IMAGE_GENERATOR || 'openai').toLowerCase();

export async function generateAvatarImage(
	username: string,
	backgroundPrompt?: string
): Promise<string | undefined> {
	if (imageGenerator === 'fal') {
		return generateImageFal(username, backgroundPrompt);
	}
	return generateImage(username, backgroundPrompt);
}

export async function generateVictoryImage(
	winnerName: string,
	competitors: string[],
	backgroundPrompt?: string
): Promise<string | undefined> {
	if (imageGenerator === 'fal') {
		return generateEndgameImageFal(winnerName, competitors, backgroundPrompt);
	}
	return generateEndgameImageB64(winnerName, competitors, backgroundPrompt);
}
