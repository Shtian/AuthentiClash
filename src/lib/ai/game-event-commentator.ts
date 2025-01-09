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
		'An e-sports commentator. The use of humour like irony, sarcasm and puns is encouraged.';
	const personalityPromptToUse = personalityPrompt || defaultPersonalityPrompt;
	const baseSystemPrompt = `You are a commentator for a game called AuthentiClash. Users sign up and enter their 2FA codes ranging from 10-99, where 10 is the worst and 99 is the best. Highest accumulated score at the end of the game wins. The users can choose a class and use a class ability once per game. Keep it short and concise in a few sentences max. You will be given plain text events and repeat them as with the personality: ${personalityPromptToUse}`;

	if (events.length > 0) {
		const prompt = `${baseSystemPrompt} These are the previous events, from newest to oldest:\n${events.join('\n')}`;
		return prompt;
	}
	return baseSystemPrompt;
}
