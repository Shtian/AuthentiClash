import { kebabCase } from '$lib/utils/casing.js';
import { generateUniqueSentence } from '$lib/utils/word-generator/generator.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { beginGameLogWithAI } from '$lib/supabase/gameLog';

export const load: PageServerLoad = async function get() {
	return {
		title: 'Create game'
	};
};

export const actions = {
	create: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const name = formData.get('game-name');
		const commentatorPersonality = formData.get('commentator-personality');
		const backgroundPrompt = formData.get('background-prompt');
		const endDate = formData.get('end-date');
		const endTime = formData.get('end-time');
		const endAt = new Date(`${endDate}T${endTime}:00Z`);

		const session = await safeGetSession();

		if (!session || !session.user) {
			return fail(401, {
				name,
				endDate,
				endTime,
				message: 'Could not find an active session, please try logging in again. 🙏'
			});
		}

		const generatedId = kebabCase`${generateUniqueSentence()}`;
		const game = {
			name,
			end_at: endAt,
			code: generatedId,
			creator: session.user.id,
			is_active: true,
			cooldown_hours: '24', // trying out a daily cooldown instead of using this field
			created_at: new Date(),
			updated_at: new Date(),
			commentator_personality: commentatorPersonality,
			background_prompt: backgroundPrompt
		};

		const { data, error } = await supabase.from('games').insert(game).select();

		if (error) {
			console.error(error.message);
			return fail(500, {
				name,
				endDate,
				endTime,
				message: 'Error creating game. Please try again. 🙏'
			});
		}

		const [gameData] = data;
		const { code, id } = gameData;

		await beginGameLogWithAI(id, commentatorPersonality as string);

		redirect(303, `/games/${code}/join`);
	}
} satisfies Actions;
