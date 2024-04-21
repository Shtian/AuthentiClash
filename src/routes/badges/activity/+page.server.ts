import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBadgeActivity } from '$lib/supabase/badges';

export const load: PageServerLoad = async ({ locals: { getSession }, url }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/auth/login');
	}

	const userId = session.user.id;
	if (!userId) return fail(401, { message: 'User not found' });

	const limit = Number(url.searchParams.get('limit')) || 10;
	const skip = Number(url.searchParams.get('skip')) || 0;

	const badgeActivity = await getBadgeActivity(limit, skip);
	if (badgeActivity.type === 'error') {
		console.error('Error getting global badge unlock stats:', badgeActivity.error.message);
		return fail(500, { message: 'Error retrieving badge stats' });
	}

	return {
		badgeActivity: badgeActivity.data.activity,
		totalEntries: badgeActivity.data.count,
		title: 'Badges'
	};
};
