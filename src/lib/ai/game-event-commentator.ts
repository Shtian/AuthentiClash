import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || OPENAI_API_KEY });

export async function generateCommentatorEvent(
	event: string,
	history: string[],
	personalityPrompt?: string
): Promise<string> {
	try {
		const systemPrompt = createSystemPrompt(history, personalityPrompt);
		const response = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: [
						{
							type: 'text',
							text: systemPrompt
						}
					]
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: event
						}
					]
				}
			],
			response_format: {
				type: 'text'
			},
			temperature: 1,
			max_completion_tokens: 10000,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0
		});
		return response.choices[0].message.content || '';
	} catch (error) {
		console.error('Error generating commentator event: ', error);
		return '';
	}
}

function createSystemPrompt(events: string[], personalityPrompt?: string) {
	const defaultPersonalityPrompt =
		'You are a game commentator, your job is to make a short and funny comment about the game, and the previous events.';
	const personalityPromptToUse = personalityPrompt || defaultPersonalityPrompt;
	const baseSystemPrompt = `${personalityPromptToUse}. Keep it short and concise in a few sentences max, the use of humour like irony, sarcasm and puns are encouraged. Get straight to the point, dont add introductory text like "and here it is folks"`;

	if (events.length > 0) {
		const prompt = `${baseSystemPrompt} These are the previous events, from newest to oldest:\n${events.join('\n')}`;
		return prompt;
	}
	return baseSystemPrompt;
}
