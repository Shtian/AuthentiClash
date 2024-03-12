import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

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
		console.debug('Revised image prompt: ', image.data[0]?.revised_prompt);

		return image.data[0].url;
	} catch (error) {
		console.error('Error generating image: ', error);
		return undefined;
	}
}

function createImagePrompt(username: string) {
	const nameStrippedOfParentheses = username.replace(/\(.*\)/, '').trim();
	const [descriptor, creature = nameStrippedOfParentheses] = nameStrippedOfParentheses.split(' ');
	return `Create an epic image of a ${descriptor} ${creature} set in a fantastical game world. This ${creature} stands prominently in a scene that captures the essence of ${descriptor}, embodying both the physical and emotional characteristics associated with the word. The backdrop is a vividly detailed landscape that enhances the ${descriptor} nature of the ${creature}, whether it be a mystical forest, a desolate wasteland, or a bustling magical city. The lighting, atmosphere, and surrounding elements should all work together to highlight the ${creature}'s unique features and the ${descriptor} mood, making it a powerful and memorable part of the game's universe`;
}
