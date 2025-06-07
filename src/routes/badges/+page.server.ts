import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabaseServerClient } from '$lib/supabase/supabaseClient';
import { getAllEnabledBadges, getGlobalBadgeUnlockStats } from '$lib/supabase/badges';
import { getTotalNumberOfPlayers } from '$lib/supabase/profiles';

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
	globalUnlockPercentage: number;
};

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const session = await safeGetSession();
	if (!session || !session.user) {
		redirect(303, '/auth/login');
	}

	const userId = session.user.id;
	if (!userId) return fail(401, { message: 'User not found' });

	const badgeUnlockCount = await getGlobalBadgeUnlockStats();
	if (badgeUnlockCount.type === 'error') {
		console.error('Error getting global badge unlock stats:', badgeUnlockCount.error.message);
		return fail(500, { message: 'Error retrieving badge stats' });
	}

	const totalNumberOfPlayers = await getTotalNumberOfPlayers();
	if (totalNumberOfPlayers.type === 'error') {
		console.error('Error getting global badge unlock stats:', totalNumberOfPlayers.error.message);
		return fail(500, { message: 'Error retrieving badge stats' });
	}
	const enabledBadgesRes = await getAllEnabledBadges();

	if (enabledBadgesRes.type === 'error') {
		console.error('Error getting enabled badges:', enabledBadgesRes.error);
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

	const badges: UserBadge[] = enabledBadgesRes.data.map((badge) => {
		const unlockedBadge = unlockedBadges.find((ub) => ub.badge_id === badge.id);
		const awardedOn = unlockedBadge?.awarded_on ? new Date(unlockedBadge.awarded_on) : undefined;
		const fiveDays = 1000 * 60 * 60 * 24 * 5;
		const isNew = awardedOn !== undefined && awardedOn > new Date(Date.now() - fiveDays);
		return {
			...badge,
			unlocked: !!unlockedBadge,
			awarded_on: awardedOn,
			isNew,
			sortOrder: badge.sort_order,
			globalUnlockPercentage: calculateGlobalUnlockPercentage(
				badgeUnlockCount.data,
				badge.id,
				totalNumberOfPlayers.data
			)
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

function calculateGlobalUnlockPercentage(
	data: { [key: number]: number },
	id: number,
	totalPlayers: number
) {
	const badgeCount = data[id] || 0;
	if (totalPlayers === 0 || badgeCount === 0) return 0;
	return (badgeCount / totalPlayers) * 100;
}
