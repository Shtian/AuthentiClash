import { generateCommentatorEventV2, setupNewCommentator } from '$lib/ai/game-event-commentator';
import { supabaseServerClient, type SupabaseResponse } from './supabaseClient';

export type GameLog = {
	id: number;
	game_id: number;
	text: string;
	text_ai: string;
	response_id?: string | null;
	created_at: string;
};

export const getGameLogs = async (gameId: string): Promise<SupabaseResponse<GameLog[]>> => {
	const { data, error } = await supabaseServerClient
		.from('game_log')
		.select('id, game_id, text, text_ai, response_id, created_at')
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
		return { type: 'error', data: null, error };
	}

	return { type: 'success', data: data || null, error: null };
};

export const addGameLogWithAIResponse = async (
	gameId: string,
	text: string,
	responseId: string,
	aiText: string
): Promise<SupabaseResponse<GameLog>> => {
	const { data, error } = await supabaseServerClient
		.from('game_log')
		.insert({ game_id: gameId, text, response_id: responseId, text_ai: aiText })
		.select()
		.single();

	if (error) {
		console.error('Error adding game log with AI response:', error.message);
		return { type: 'error', data: null, error };
	}

	return { type: 'success', data: data || null, error: null };
};

export const addGameLogWithAI = async (
	gameId: string,
	text: string
): Promise<SupabaseResponse<GameLog>> => {
	const previousLog = await getLatestGameLogWithResponseId(gameId);

	if (previousLog.type === 'error' || !previousLog.data?.response_id) {
		return addGameLog(gameId, text);
	}

	const aiResponse = await generateCommentatorEventV2(text, previousLog.data.response_id);

	if (aiResponse.type === 'error') {
		return addGameLog(gameId, text);
	}

	return addGameLogWithAIResponse(gameId, text, aiResponse.response_id, aiResponse.output_text);
};

export const beginGameLogWithAI = async (
	gameId: string,
	personalityPrompt: string
): Promise<SupabaseResponse<GameLog>> => {
	const aiText = await setupNewCommentator(personalityPrompt);
	if (aiText.type === 'error') {
		console.error('Error setting up new commentator:', aiText.error);
		return { type: 'error', data: null, error: new Error(aiText.error) };
	}

	const { data, error } = await supabaseServerClient
		.from('game_log')
		.insert({
			game_id: gameId,
			text: aiText.output_text,
			text_ai: aiText.output_text,
			response_id: aiText.response_id
		})
		.select()
		.single();

	if (error) {
		console.error('Error adding game log:', error.message);
		const r: SupabaseResponse<GameLog> = { type: 'error', data: null, error };
		return r;
	}

	return { type: 'success', data: data || null, error: null };
};

export const getLatestGameLogWithResponseId = async (
	gameId: string
): Promise<SupabaseResponse<{ response_id: string }>> => {
	const { data, error } = await supabaseServerClient
		.from('game_log')
		.select('response_id')
		.eq('game_id', gameId)
		.not('response_id', 'is', null)
		.order('created_at', { ascending: false })
		.limit(1)
		.single();

	if (error) {
		console.error('Error getting latest game log with response ID:', error.message);
		const r: SupabaseResponse<{ response_id: string }> = { type: 'error', data: null, error };
		return r;
	}

	return { type: 'success', data: data || null, error: null };
};
