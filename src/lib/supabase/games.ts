import { mapToParticipation, type Participation } from './participation';
import { supabaseServerClient, type SupabaseResponse } from './supabaseClient';

type Game = {
	id: number;
	end_at: string;
	name: string;
	cooldown_hours: number;
	ai_enabled: boolean;
	participation: Participation[];
};

export type EndedActiveGame = {
	id: number;
	participation: string[];
};

export const getGame = async (code: string): Promise<SupabaseResponse<Game | null>> => {
	const { data: game, error } = await supabaseServerClient
		.from('games')
		.select(
			'id, code, creator, end_at, is_active, name, cooldown_hours, ai_enabled, participation ( id, score, total_score, profile_id, updated_at, nickname_image_url, nickname, ability_used, class_id )'
		)
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
	const { data: games, error } = await supabaseServerClient
		.from('games')
		.select(
			'id, code, creator, end_at, is_active, name, cooldown_hours, ai_enabled, participation ( id, score, total_score, profile_id, updated_at, nickname_image_url, nickname, ability_used, class_id )'
		);

	if (error !== null) {
		const r: SupabaseResponse<Game[]> = { type: 'error', data: null, error };
		return r;
	}

	const participatingGames = games.filter((game) =>
		game.participation.some((participation) => participation.profile_id === userId)
	);

	const successResponse: SupabaseResponse<Game[]> = {
		type: 'success',
		data: participatingGames.map(mapToGame),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToGame = (data: any): Game => {
	return {
		id: data.id as number,
		end_at: data.end_at as string,
		ai_enabled: data.ai_enabled as boolean,
		name: data.name as string,
		cooldown_hours: data.cooldown_hours as number,
		participation: data.participation.map(mapToParticipation)
	};
};
