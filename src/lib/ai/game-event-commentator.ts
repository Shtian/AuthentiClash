import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || OPENAI_API_KEY });
const COMMENTATOR_MODEL = 'gpt-5-nano';

type CommentatorEventResponse =
	| {
			output_text: string;
			response_id: string;
			type: 'success';
			error: null;
	  }
	| {
			error: string;
			output_text: '';
			type: 'error';
	  };

export async function setupNewCommentator(
	personalityPrompt: string
): Promise<CommentatorEventResponse> {
	try {
		const defaultPersonalityPrompt =
			'An e-sports commentator. The use of humour like irony, sarcasm and puns is encouraged.';
		const personalityPromptToUse = personalityPrompt || defaultPersonalityPrompt;
		const baseSystemPrompt = `You are a commentator for a game called AuthentiClash. Users sign up and enter their 2FA codes ranging from 10-99, where 10 is the worst and 99 is the best. Highest accumulated score at the end of the game wins. The users can choose a class and use a class ability once per game. Keep it short and concise in a few sentences max. You will be given plain text events and repeat them as with the personality: ${personalityPromptToUse}`;

		const response = await openaiClient.responses.create({
			model: COMMENTATOR_MODEL,
			input: [
				{
					role: 'system',
					content: baseSystemPrompt
				},
				{
					role: 'user',
					content:
						'Introduce yourself as a commentator for the game AuthentiClash. Include your name.'
				}
			]
		});
		return {
			output_text: response.output_text,
			response_id: response.id,
			type: 'success',
			error: null
		};
	} catch (error) {
		console.error('Error generating commentator event: ', error);
		return {
			output_text: '',
			type: 'error',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

export async function generateCommentatorEventV2(
	event: string,
	previousEventId: string
): Promise<CommentatorEventResponse> {
	try {
		const response = await openaiClient.responses.create({
			model: COMMENTATOR_MODEL,
			input: [{ role: 'user', content: event }],
			previous_response_id: previousEventId
		});

		return {
			output_text: response.output_text,
			response_id: response.id,
			type: 'success',
			error: null
		};
	} catch (error) {
		console.error('Error generating commentator event: ', error);
		return {
			output_text: '',
			type: 'error',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}
