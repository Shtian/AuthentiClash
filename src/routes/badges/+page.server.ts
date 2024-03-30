import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type Badge = {
	awarded_on?: Date;
	description: string;
	image?: string;
	name: string;
	slug: string;
	secret: boolean;
};

type UserBadge = Badge & {
	unlocked: boolean;
	isNew: boolean;
};

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

	if (!allBadges?.length) {
		return {
			badges: [],
			title: 'Badges'
		};
	}

	const { data: unlockedBadges, error: unlockedBadgesError } = await supabase
		.from('player_badges')
		.select('player_id, badge_id, awarded_on')
		.eq('player_id', session.user.id);

	if (unlockedBadgesError) {
		return fail(500, { message: unlockedBadgesError });
	}

	const badges: Array<UserBadge> = allBadges.map((badge) => {
		const unlockedBadge = unlockedBadges.find((ub) => ub.badge_id === badge.id);
		const awardedOn = unlockedBadge?.awarded_on ? new Date(unlockedBadge.awarded_on) : undefined;
		const fiveDays = 1000 * 60 * 60 * 24 * 5;
		const isNew = awardedOn !== undefined && awardedOn > new Date(Date.now() - fiveDays);
		return {
			...badge,
			unlocked: !!unlockedBadge,
			awarded_on: awardedOn,
			isNew
		};
	});

	// sort badges by secret (not secret -> secret), then alphabetically by name
	badges.sort((a: UserBadge, b: UserBadge) => {
		if (a.secret && !b.secret) return 1;
		if (!a.secret && b.secret) return -1;
		if (a.name < b.name) return -1;
		if (a.name > b.name) return 1;
		return 0;
	});

	return {
		badges,
		title: 'Badges'
	};
};
