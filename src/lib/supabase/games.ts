import { mapToParticipation, type Participation } from './participation';
import { supabaseServerClient, type SupabaseResponse } from './supabaseClient';

export type Game = {
	id: number;
	code: string;
	end_at: string;
	name: string;
	cooldown_hours: number;
	ai_enabled: boolean;
	background_prompt?: string;
	participation: Participation[];
};

export type EndedActiveGame = {
	id: number;
	participation: string[];
};

const GAME_SELECT_QUERY =
	'id, code, creator, end_at, is_active, name, cooldown_hours, ai_enabled, background_prompt, participation ( id, score, total_score, profile_id, updated_at, nickname_image_url, nickname, ability_used, class_id )';

export const getGame = async (code: string): Promise<SupabaseResponse<Game | null>> => {
	const { data: game, error } = await supabaseServerClient
		.from('games')
		.select(GAME_SELECT_QUERY)
		.eq('code', code)
		.maybeSingle();

	if (error !== null) {
		const r: SupabaseResponse<Game> = { type: 'error', data: null, error };
		return r;
	}

	const successResponse: SupabaseResponse<Game | null> = {
		type: 'success',
		data: game ? mapToGame(game) : null,
		error: null
	};

	return successResponse;
};

export const getEndedActiveGames = async (): Promise<SupabaseResponse<EndedActiveGame[]>> => {
	const { data, error } = await supabaseServerClient
		.from('games')
		.select('id, end_at, participation( profile_id )')
		.eq('is_active', true);

	if (error !== null) {
		const r: SupabaseResponse<EndedActiveGame[]> = { type: 'error', data: null, error };
		return r;
	}

	const endedActiveGames = data
		.filter((game) => new Date(game.end_at) < new Date())
		.map((game) => ({
			id: game.id as number,
			participation: game.participation.map((p) => p.profile_id as string)
		}));

	const successResponse: SupabaseResponse<EndedActiveGame[]> = {
		type: 'success',
		data: endedActiveGames,
		error: null
	};
	return successResponse;
};

export const getAllGamesByUserId = async (userId: string): Promise<SupabaseResponse<Game[]>> => {
	const { data: matchingParticipations, error: pError } = await supabaseServerClient
		.from('participation')
		.select('game_id')
		.eq('profile_id', userId);

	if (pError !== null) {
		const r: SupabaseResponse<Game[]> = { type: 'error', data: null, error: pError };
		return r;
	}

	const gameIds = matchingParticipations.map((p) => p.game_id);
	const { data: participatingGames, error } = await supabaseServerClient
		.from('games')
		.select(GAME_SELECT_QUERY)
		.in('id', gameIds);

	if (error !== null) {
		const r: SupabaseResponse<Game[]> = { type: 'error', data: null, error };
		return r;
	}

	const successResponse: SupabaseResponse<Game[]> = {
		type: 'success',
		data: participatingGames.map(mapToGame),
		error: null
	};
	return successResponse;
};

export const getActiveGamesByUserId = async (userId: string): Promise<SupabaseResponse<Game[]>> => {
	const { data: matchingParticipations, error: pError } = await supabaseServerClient
		.from('participation')
		.select('game_id')
		.eq('profile_id', userId);

	if (pError !== null) {
		const r: SupabaseResponse<Game[]> = { type: 'error', data: null, error: pError };
		return r;
	}

	const gameIds = matchingParticipations.map((p) => p.game_id).filter((id) => id !== null);
	const { data: participatingGames, error } = await supabaseServerClient
		.from('games')
		.select(GAME_SELECT_QUERY)
		.in('id', gameIds)
		.gt('end_at', new Date().toISOString());

	if (error !== null) {
		const r: SupabaseResponse<Game[]> = { type: 'error', data: null, error };
		return r;
	}

	const successResponse: SupabaseResponse<Game[]> = {
		type: 'success',
		data: participatingGames.map(mapToGame),
		error: null
	};
	return successResponse;
};

export const getEndedGamesByUserId = async (userId: string): Promise<SupabaseResponse<Game[]>> => {
	const { data: matchingParticipations, error: pError } = await supabaseServerClient
		.from('participation')
		.select('game_id')
		.eq('profile_id', userId);

	if (pError !== null) {
		const r: SupabaseResponse<Game[]> = { type: 'error', data: null, error: pError };
		return r;
	}

	const gameIds = matchingParticipations.map((p) => p.game_id).filter((id) => id !== null);
	const { data: participatingGames, error } = await supabaseServerClient
		.from('games')
		.select(GAME_SELECT_QUERY)
		.in('id', gameIds)
		.lte('end_at', new Date().toISOString());

	if (error !== null) {
		const r: SupabaseResponse<Game[]> = { type: 'error', data: null, error };
		return r;
	}

	const successResponse: SupabaseResponse<Game[]> = {
		type: 'success',
		data: participatingGames.map(mapToGame),
		error: null
	};
	return successResponse;
};

export const getAllGamesCreatedByUserId = async (
	userId: string
): Promise<SupabaseResponse<Game[]>> => {
	const { data: createdGames, error } = await supabaseServerClient
		.from('games')
		.select(GAME_SELECT_QUERY)
		.eq('creator', userId);

	if (error !== null) {
		const r: SupabaseResponse<Game[]> = { type: 'error', data: null, error };
		return r;
	}

	const successResponse: SupabaseResponse<Game[]> = {
		type: 'success',
		data: createdGames.map(mapToGame),
		error: null
	};
	return successResponse;
};

export const deactivateGame = async (id: number): Promise<SupabaseResponse<boolean>> => {
	const { error } = await supabaseServerClient
		.from('games')
		.update({ is_active: false })
		.eq('id', id);

	if (error !== null) {
		console.error('Error deactivating game ' + id + ':', error.message);
		const r: SupabaseResponse<void> = { type: 'error', data: null, error };
		return r;
	}

	const successResponse: SupabaseResponse<boolean> = {
		type: 'success',
		data: true,
		error: null
	};

	console.info('Deactivated game ' + id + ' successfully.');
	return successResponse;
};

export const getGameCommentatorPersonality = async (
	gameId: string
): Promise<SupabaseResponse<string>> => {
	const { data, error } = await supabaseServerClient
		.from('games')
		.select('commentator_personality')
		.eq('id', gameId)
		.single();

	if (error !== null) {
		console.error('Error getting commentator personality:', error.message);
		const r: SupabaseResponse<string> = { type: 'error', data: null, error };
		return r;
	}

	const successResponse: SupabaseResponse<string> = {
		type: 'success',
		data: data.commentator_personality || '',
		error: null
	};
	return successResponse;
};

const mapToGame = (data: any): Game => {
	return {
		id: data.id as number,
		code: data.code as string,
		end_at: data.end_at as string,
		ai_enabled: data.ai_enabled as boolean,
		name: data.name as string,
		cooldown_hours: data.cooldown_hours as number,
		background_prompt: data.background_prompt as string | undefined,
		participation: data.participation.map(mapToParticipation)
	};
};
