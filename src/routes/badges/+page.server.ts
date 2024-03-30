import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/auth/login');
	}

	const userId = session.user.id;
	if (!userId) return fail(401, { message: 'User not found' });

	const { data: allBadges, error: badgesError } = await supabase
		.from('badges')
		.select('name, description, image, secret, enabled, slug, id')
		.is('enabled', true);

	if (badgesError) {
		return fail(500, { message: badgesError });
	}

	const { data: unlockedBadges, error: unlockedBadgesError } = await supabase
		.from('player_badges')
		.select('player_id, badge_id, awarded_on')
		.eq('player_id', session.user.id);

	if (unlockedBadgesError) {
		return fail(500, { message: unlockedBadgesError });
	}

	const badges = allBadges.map((badge) => {
		const unlockedBadge = unlockedBadges.find((ub) => ub.badge_id === badge.id);
		return {
			...badge,
			unlocked: !!unlockedBadge,
			awarded_on: unlockedBadge?.awarded_on
		};
	});

	return {
		badges,
		title: 'Badges'
	};
};
