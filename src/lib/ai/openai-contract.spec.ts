import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

type Captured = { method: string; path: string; body: unknown };

const captured: Captured[] = [];
const replies: Record<string, unknown> = {
	'/v1/responses': {
		id: 'resp_2',
		object: 'response',
		created_at: 0,
		status: 'completed',
		model: 'gpt-4.1-mini',
		output: [
			{
				id: 'msg_1',
				type: 'message',
				role: 'assistant',
				status: 'completed',
				content: [{ type: 'output_text', text: 'What a comeback!', annotations: [] }]
			}
		]
	},
	'/v1/images/generations': { created: 0, data: [{ b64_json: 'aGVsbG8=' }] }
};

let server: Server;

beforeAll(async () => {
	server = createServer((req, res) => {
		let raw = '';
		req.on('data', (chunk) => (raw += chunk));
		req.on('end', () => {
			const path = req.url ?? '';
			captured.push({ method: req.method ?? '', path, body: JSON.parse(raw || 'null') });
			res.writeHead(200, { 'content-type': 'application/json' });
			res.end(JSON.stringify(replies[path] ?? {}));
		});
	});
	await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
	const { port } = server.address() as AddressInfo;
	process.env.OPENAI_BASE_URL = `http://127.0.0.1:${port}/v1`;
});

afterAll(() => {
	server.close();
});

describe('OpenAI SDK contract', () => {
	it('sends a follow-up commentary event and reads the reply text', async () => {
		const { generateCommentatorEventV2 } = await import('./game-event-commentator');
		captured.length = 0;

		const result = await generateCommentatorEventV2('Alice scored 99', 'resp_1');

		expect(result).toEqual({
			output_text: 'What a comeback!',
			response_id: 'resp_2',
			type: 'success',
			error: null
		});
		expect(captured).toEqual([
			{
				method: 'POST',
				path: '/v1/responses',
				body: {
					model: 'gpt-4.1-mini',
					input: [{ role: 'user', content: 'Alice scored 99' }],
					previous_response_id: 'resp_1'
				}
			}
		]);
	});

	it('returns the base64 image from an image generation', async () => {
		const { generateImage } = await import('./image-generator');
		captured.length = 0;

		const result = await generateImage('alice');

		expect(result).toBe('aGVsbG8=');
		expect(captured.map(({ method, path }) => `${method} ${path}`)).toEqual([
			'POST /v1/images/generations'
		]);
	});
});
