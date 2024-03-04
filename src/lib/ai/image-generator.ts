import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function generateImage(username: string): Promise<string | undefined> {
	try {
		const nameStrippedOfParentheses = username.replace(/\(.*\)/, '').trim();
		const image = await openaiClient.images.generate({
			quality: 'standard',
			model: 'dall-e-3',
			size: '1024x1024',
			n: 1,
			response_format: 'url',
			prompt: `Epic portrait of a ${nameStrippedOfParentheses}`
		});

		return image.data[0].url;
	} catch (error) {
		console.error('Error generating image', error);
		return undefined;
	}
}
