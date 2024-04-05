import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabaseServerClient } from '$lib/supabase/supabaseClient';
import { getAllEnabledBadges } from '$lib/supabase/badges';

type Badge = {
	awarded_on?: Date;
	description: string;
	image?: string;
	name: string;
	slug: string;
	secret: boolean;
	sortOrder: number;
};

export type UserBadge = Badge & {
	unlocked: boolean;
	isNew: boolean;
};

export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/auth/login');
	}

	const userId = session.user.id;
	if (!userId) return fail(401, { message: 'User not found' });

	const enabledBadgesRes = await getAllEnabledBadges();

	if (enabledBadgesRes.type === 'error') {
		console.log('Error getting enabled badges:', enabledBadgesRes.error);
		return fail(500, { message: 'Error retrieving badges' });
	}

	if (!enabledBadgesRes.data?.length) {
		return {
			badges: [],
			title: 'Badges'
		};
	}

	const { data: unlockedBadges, error: unlockedBadgesError } = await supabaseServerClient
		.from('player_badges')
		.select('player_id, badge_id, awarded_on')
		.eq('player_id', session.user.id);

	if (unlockedBadgesError) {
		return fail(500, { message: unlockedBadgesError });
	}

	const badges: Array<UserBadge> = enabledBadgesRes.data.map((badge) => {
		const unlockedBadge = unlockedBadges.find((ub) => ub.badge_id === badge.id);
		const awardedOn = unlockedBadge?.awarded_on ? new Date(unlockedBadge.awarded_on) : undefined;
		const fiveDays = 1000 * 60 * 60 * 24 * 5;
		const isNew = awardedOn !== undefined && awardedOn > new Date(Date.now() - fiveDays);
		return {
			...badge,
			unlocked: !!unlockedBadge,
			awarded_on: awardedOn,
			isNew,
			sortOrder: badge.sort_order
		};
	});

	// sort badges by secret (not secret -> secret), then by sort order
	badges.sort((a, b) => {
		if (a.secret === b.secret) {
			return a.sortOrder - b.sortOrder;
		}
		return a.secret ? 1 : -1;
	});

	return {
		badges,
		title: 'Badges'
	};
};
