import { supabaseServerClient, type SupabaseResponse } from './supabaseClient';

export const getTotalNumberOfPlayers = async (): Promise<SupabaseResponse<number>> => {
	const { count: numberOfPlayers, error: playerCountError } = await supabaseServerClient
		.from('profiles')
		.select('*', { count: 'exact', head: true });

	if (playerCountError !== null) {
		console.error('Error getting global badge unlock stats:', playerCountError.message);
		const r: SupabaseResponse<number> = { type: 'error', data: null, error: playerCountError };
		return r;
	}

	return { type: 'success', data: numberOfPlayers || 0, error: null };
};
