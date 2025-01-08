import { kebabCase } from '$lib/utils/casing.js';
import { generateUniqueSentence } from '$lib/utils/word-generator/generator.js';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async function get() {
	return {
		title: 'Create game'
	};
};

export const actions = {
	create: async ({ request, locals: { supabase, getSession } }) => {
		const formData = await request.formData();
		const name = formData.get('game-name');
		const cooldown = formData.get('2fa-cooldown');
		const commentatorPersonality = formData.get('commentator-personality');
		const endDate = formData.get('end-date');
		const endTime = formData.get('end-time');
		const endAt = new Date(`${endDate}T${endTime}:00Z`);

		const session = await getSession();

		if (!session) {
			return fail(401, {
				name,
				endDate,
				endTime,
				cooldown,
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
			cooldown_hours: cooldown,
			created_at: new Date(),
			updated_at: new Date(),
			commentator_personality: commentatorPersonality
		};

		const { data, error } = await supabase.from('games').insert(game).select();

		if (error) {
			console.error(error.message);
			return fail(500, {
				name,
				endDate,
				endTime,
				cooldown,
				message: 'Error creating game. Please try again. 🙏'
			});
		}

		const [gameData] = data;
		const { code } = gameData;
		redirect(303, `/games/${code}/join`);
	}
};
