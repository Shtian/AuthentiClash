import { supabaseServerClient, type SupabaseResponse } from './supabaseClient';

type Class = {
	id: number;
	name: string;
	description: string;
	abilities: Array<Ability>;
};
type Ability = {
	id: number;
	name: string;
	description: string;
};

export const getAllClasses = async (): Promise<SupabaseResponse<Array<Class>>> => {
	const { data, error } = await supabaseServerClient
		.from('classes')
		.select('id,name,description,abilities(id,name,description,created_at)');

	if (error) {
		console.error('Error getting all classes:', error.message);
		const r: SupabaseResponse<Array<Class>> = { type: 'error', data: null, error };
		return r;
	}
	console.log(data);
	return { type: 'success', data: data || [], error: null };
};
