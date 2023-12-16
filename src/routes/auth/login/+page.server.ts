import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	// if the user is already logged in return them to the games page
	if (session) {
		throw redirect(303, '/games');
	}

	return { url: url.origin };
};
