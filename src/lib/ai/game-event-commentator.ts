import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || OPENAI_API_KEY });

export async function generateCommentatorEvent(event: string, history: string[]): Promise<string> {
	try {
		const systemPrompt = createSystemPrompt(history);
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

function createSystemPrompt(events: string[]) {
	const baseSystemPrompt =
		'You are an e-sports commentator for my game called AuthentiClash. Users sign up and enter their 2FA codes ranging from 10-99, where 10 is the worst and 99 is the best. Highest accumulated score at the end of the game wins. The users can choose a class and use a class ability once per game. You are to take the plain text events and repeat them as an e-sports commentator for some flavor in the event timeline. Keep it short and concise in a few sentences max, the use of humour like irony, sarcasm and puns are encouraged. Get straight to the point, dont add introductory text like "and here it is folks".';

	if (events.length > 0) {
		const prompt = `${baseSystemPrompt} These are the previous events, from newest to oldest:\n${events.join('\n')}`;
		return prompt;
	}
	return baseSystemPrompt;
}
