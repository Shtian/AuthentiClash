import { supabase, type SupabaseResponse } from './supabaseClient';

type Participation = {
	id: string;
	profileId: string;
	gameId: string;
	nickname: string;
	createdAt: string;
	updatedAt: string;
	score: number[];
	totalScore: number;
	nicknameImageUrl: string;
};

export const getParticipation = async (
	userId: string,
	gameId: string
): Promise<SupabaseResponse<Participation>> => {
	const { data, error } = await supabase
		.from('participation')
		.select(
			'id, score, total_score, updated_at, profile_id, game_id, nickname, created_at, nickname_image_url'
		)
		.eq('game_id', gameId)
		.eq('profile_id', userId)
		.single();

	if (error !== null) {
		const r: SupabaseResponse<Participation> = { type: 'error', data: null, error };
		return r;
	}

	const participation = mapToParticipation(data);

	const successResponse: SupabaseResponse<Participation> = {
		type: 'sucess',
		data: participation,
		error: null
	};
	return successResponse;
};

export const updateParticipationScore = async (
	score: number,
	existingParticipation: Partial<Participation>
): Promise<SupabaseResponse<Participation>> => {
	const existingScore = existingParticipation.score || [];
	const newScore = [...existingScore, score];
	const newTotalScore = newScore.reduce((acc, curr) => acc + curr, 0);
	const { data, error } = await supabase
		.from('participation')
		.update({ score: newScore, total_score: newTotalScore, updated_at: new Date() })
		.eq('id', existingParticipation.id)
		.select()
		.single();

	if (error !== null) {
		const r: SupabaseResponse<Participation> = { type: 'error', data: null, error };
		return r;
	}

	const participation = mapToParticipation(data);

	const successResponse: SupabaseResponse<Participation> = {
		type: 'sucess',
		data: participation,
		error: null
	};

	return successResponse;
};

export const updateParticipationNicknameImage = async (
	nicknameImageUrl: string,
	participationId: string
): Promise<SupabaseResponse<Participation>> => {
	const { data, error } = await supabase
		.from('participation')
		.update({ nickname_image_url: nicknameImageUrl })
		.eq('id', participationId)
		.select()
		.single();

	if (error !== null) {
		console.error('Error updating nickname image:', error.message);
		const r: SupabaseResponse<Participation> = { type: 'error', data: null, error };
		return r;
	}

	const participation = mapToParticipation(data);

	const successResponse: SupabaseResponse<Participation> = {
		type: 'sucess',
		data: participation,
		error: null
	};

	return successResponse;
};

export const addParticipation = async (
	gameId: string,
	userId: string,
	nickname: string,
	score: number
): Promise<SupabaseResponse<Participation>> => {
	const participationData = {
		nickname,
		score: [score],
		total_score: score,
		profile_id: userId,
		game_id: gameId,
		created_at: new Date(),
		updated_at: new Date()
	};
	const { data, error } = await supabase
		.from('participation')
		.insert(participationData)
		.select()
		.single();

	if (error !== null) {
		const r: SupabaseResponse<Participation> = { type: 'error', data: null, error };
		return r;
	}

	const participation = mapToParticipation(data);

	const successResponse: SupabaseResponse<Participation> = {
		type: 'sucess',
		data: participation,
		error: null
	};

	return successResponse;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToParticipation = (data: any) => {
	const participation: Participation = {
		id: data.id,
		score: data.score,
		totalScore: data.total_score,
		updatedAt: data.updated_at,
		profileId: data.game_id,
		gameId: data.game_id,
		nickname: data.nickname,
		createdAt: data.created_at,
		nicknameImageUrl: data.nickname_image_url
	};
	return participation;
};
