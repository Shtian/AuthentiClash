import { CLASSES, DIVINE_AEGIS_PERCENTAGE } from '$lib/classes/abilities';
import { mapToParticipation, type Participation } from '../participation';
import { supabaseServerClient, type SupabaseResponse } from '../supabaseClient';

export const giveOtherPlayerScore = async (
	score: number,
	existingParticipation: Partial<Participation>
): Promise<SupabaseResponse<Participation>> => {
	const existingScore = existingParticipation.score || [];
	const scoreAfterClassMitigations = classMitigation(score, existingParticipation);
	const newScore = [...existingScore, scoreAfterClassMitigations];
	const newTotalScore = newScore.reduce((acc, curr) => acc + curr, 0);
	const { data, error } = await supabaseServerClient
		.from('participation')
		.update({
			score: newScore,
			total_score: newTotalScore
		})
		.eq('id', existingParticipation.id)
		.select()
		.single();

	if (error !== null) {
		const r: SupabaseResponse<Participation> = { type: 'error', data: null, error };
		return r;
	}

	const participation = mapToParticipation(data);

	const successResponse: SupabaseResponse<Participation> = {
		type: 'success',
		data: participation,
		error: null
	};

	return successResponse;
};

const classMitigation = (score: number, participation: Partial<Participation>) => {
	if (score < 0 && participation.classId === CLASSES.PALADIN) {
		return Math.ceil(score * (1 - DIVINE_AEGIS_PERCENTAGE));
	}
	return score;
};
