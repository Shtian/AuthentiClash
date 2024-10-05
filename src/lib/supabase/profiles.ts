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

export const getUsername = async (userId: string): Promise<SupabaseResponse<string>> => {
	const { data, error } = await supabaseServerClient
		.from('profiles')
		.select('username')
		.eq('id', userId)
		.single();

	if (error !== null) {
		console.error('Error getting username:', error.message);
		const r: SupabaseResponse<string> = { type: 'error', data: null, error };
		return r;
	}

	return { type: 'success', data: data?.username || '', error: null };
};
