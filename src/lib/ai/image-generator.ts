import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';
import backdrops from './backdrops.json';

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || OPENAI_API_KEY });

export async function generateImage(username: string): Promise<string | undefined> {
	try {
		const prompt = createImagePrompt(username);
		console.debug('Generating image with prompt: ', prompt);
		const image = await openaiClient.images.generate({
			quality: 'standard',
			model: 'dall-e-3',
			size: '1024x1024',
			n: 1,
			response_format: 'url',
			prompt
		});

		if (!image.data) {
			console.error('No image data returned from OpenAI');
			return undefined;
		}

		console.debug('Revised image prompt: ', image.data[0]?.revised_prompt);
		console.debug('Image URL: ', image.data[0]?.url);
		return image.data[0].url;
	} catch (error) {
		console.error('Error generating image: ', error);
		return undefined;
	}
}

function createImagePrompt(username: string) {
	const nameStrippedOfParentheses = username.replace(/\(.*\)/, '').trim();
	const [descriptor, creature = nameStrippedOfParentheses] = nameStrippedOfParentheses.split(' ');
	const backdrop = backdrops[Math.floor(Math.random() * backdrops.length)];
	return `Create an image of a ${descriptor} ${creature}, with the background theme of "${backdrop}".`;
}
