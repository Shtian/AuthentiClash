import { generateCommentatorEvent } from '$lib/ai/game-event-commentator';
import { getGameCommentatorPersonality } from './games';
import { supabaseServerClient, type SupabaseResponse } from './supabaseClient';

export type GameLog = {
	id: number;
	game_id: number;
	text: string;
	text_ai: string;
	created_at: string;
};

export const getGameLogs = async (gameId: string): Promise<SupabaseResponse<GameLog[]>> => {
	const { data, error } = await supabaseServerClient
		.from('game_log')
		.select('id, game_id, text, text_ai, created_at')
		.eq('game_id', gameId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error getting all classes:', error.message);
		const r: SupabaseResponse<GameLog[]> = { type: 'error', data: null, error };
		return r;
	}

	return { type: 'success', data: data || [], error: null };
};

export const addGameLog = async (
	gameId: string,
	text: string
): Promise<SupabaseResponse<GameLog>> => {
	const { data, error } = await supabaseServerClient
		.from('game_log')
		.insert({ game_id: gameId, text })
		.select()
		.single();

	if (error) {
		console.error('Error adding game log:', error.message);
		const r: SupabaseResponse<GameLog> = { type: 'error', data: null, error };
		return r;
	}

	return { type: 'success', data: data || null, error: null };
};

export const addGameLogWithAI = async (
	gameId: string,
	text: string
): Promise<SupabaseResponse<GameLog>> => {
	const previousLogs = await getGameLogs(gameId);
	const personality = await getGameCommentatorPersonality(gameId);
	const aiText =
		previousLogs.type === 'success' && personality.type === 'success'
			? await generateCommentatorEvent(
					text,
					previousLogs.data.map((log) => log.text),
					personality.data
				)
			: '';

	const { data, error } = await supabaseServerClient
		.from('game_log')
		.insert({ game_id: gameId, text, text_ai: aiText })
		.select()
		.single();

	if (error) {
		console.error('Error adding game log:', error.message);
		const r: SupabaseResponse<GameLog> = { type: 'error', data: null, error };
		return r;
	}

	return { type: 'success', data: data || null, error: null };
};
