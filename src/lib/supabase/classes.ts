import { supabaseServerClient, type SupabaseResponse } from './supabaseClient';

export type Class = {
	id: number;
	name: string;
	description: string;
	abilities: Ability[];
};

export type Ability = {
	id: number;
	name: string;
	description: string;
};

export const getAllClasses = async (): Promise<SupabaseResponse<Class[]>> => {
	const { data, error } = await supabaseServerClient
		.from('classes')
		.select('id,name,description,abilities(id,name,description)');

	if (error) {
		console.error('Error getting all classes:', error.message);
		const r: SupabaseResponse<Class[]> = { type: 'error', data: null, error };
		return r;
	}

	return { type: 'success', data: data || [], error: null };
};

export const getClass = async (classId: number | null): Promise<SupabaseResponse<Class | null>> => {
	if (classId == null) {
		return { type: 'success', data: null, error: null };
	}

	const { data, error } = await supabaseServerClient
		.from('classes')
		.select('id,name,description,abilities(id,name,description)')
		.eq('id', classId)
		.single();

	if (error) {
		console.error('Error getting class:', error.message);
		const r: SupabaseResponse<Class> = { type: 'error', data: null, error };
		return r;
	}

	return { type: 'success', data: data || null, error: null };
};
