import type { BadgeSlug } from '$lib/badges/badgeSlugs';
import { supabaseServerClient, type SupabaseResponse } from '$lib/supabase/supabaseClient';

type BadgeDTO = {
	id: number;
	name: string;
	description: string;
	image: string;
	slug: string;
	enabled: boolean;
	secret: boolean;
};

type PlayerBadgesDTO = {
	player_id: string;
	badge_id: number;
	awarded_on: Date;
};

type PlayerBadgesInsertDTO = {
	player_id: string;
	badge_id: number;
};

export type UnlockPlayerBadgeResponse = 'unlocked' | 'exists' | 'not unlocked';

export const getAllEnabledBadges = async (): Promise<SupabaseResponse<BadgeDTO[]>> => {
	const { data, error } = await supabaseServerClient
		.from('badges')
		.select('id, name, description, image, slug, enabled, secret')
		.eq('enabled', true);

	if (error !== null) {
		console.error('Error getting enabled badges:', error.message);
		const r: SupabaseResponse<BadgeDTO[]> = { type: 'error', data: null, error };
		return r;
	}

	const badges = data.map(mapToBadge);

	const successResponse: SupabaseResponse<BadgeDTO[]> = {
		type: 'success',
		data: badges,
		error: null
	};

	return successResponse;
};

export const getBadgeBySlug = async (slug: string): Promise<SupabaseResponse<BadgeDTO>> => {
	const { data, error } = await supabaseServerClient
		.from('badges')
		.select('id, name, description, image, slug, enabled, secret')
		.eq('slug', slug)
		.single();

	if (error !== null) {
		console.error('Error getting badge by slug:', error.message);
		const r: SupabaseResponse<BadgeDTO> = { type: 'error', data: null, error };
		return r;
	}

	const badge = mapToBadge(data);

	const successResponse: SupabaseResponse<BadgeDTO> = {
		type: 'success',
		data: badge,
		error: null
	};

	return successResponse;
};

export const getBadgesByUserId = async (
	userId: string
): Promise<SupabaseResponse<PlayerBadgesDTO[]>> => {
	const { data, error } = await supabaseServerClient
		.from('player_badges')
		.select('player_id, badge_id, awarded_on')
		.eq('player_id', userId);

	if (error !== null) {
		console.error('Error getting badges by user id:', error.message);
		const r: SupabaseResponse<PlayerBadgesDTO[]> = { type: 'error', data: null, error };
		return r;
	}

	const playerBadges = data.map((d) => mapToPlayerBadge(d));
	const response: SupabaseResponse<PlayerBadgesDTO[]> = {
		type: 'success',
		data: playerBadges,
		error: null
	};
	return response;
};

export const tryUnlockBadge = async (
	badgeSlug: BadgeSlug,
	userId: string
): Promise<SupabaseResponse<UnlockPlayerBadgeResponse>> => {
	const badgeRes = await getBadgeBySlug(badgeSlug);
	const userBadges = await getBadgesByUserId(userId);

	if (badgeRes.type === 'error') {
		return {
			type: 'error',
			data: null,
			error: badgeRes.error
		};
	}

	if (userBadges.type === 'error') {
		return {
			type: 'error',
			data: null,
			error: userBadges.error
		};
	}

	if (userBadges.data.some((b) => b.badge_id === badgeRes.data.id)) {
		return { type: 'success', data: 'exists', error: null };
	}

	const badge = badgeRes.data;
	const playerBadgeData: PlayerBadgesInsertDTO = {
		player_id: userId,
		badge_id: badge.id
	};

	const { error } = await supabaseServerClient.from('player_badges').insert(playerBadgeData);

	if (error) {
		console.error('Error awarding badge:', error.message);
		return {
			type: 'error',
			data: null,
			error
		};
	}

	console.debug(`Badge ${badgeSlug} awarded to user ${userId}`);
	return {
		type: 'success',
		data: 'unlocked',
		error: null
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToBadge = (data: any) => {
	const badgeDTO: BadgeDTO = {
		id: data.id,
		name: data.name,
		description: data.description,
		image: data.image,
		slug: data.slug,
		enabled: data.enabled,
		secret: data.secret
	};

	return badgeDTO;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToPlayerBadge = (data: any) => {
	const playerBadgesDTO: PlayerBadgesDTO = {
		player_id: data.player_id,
		badge_id: data.badge_id,
		awarded_on: data.awarded_on
	};

	return playerBadgesDTO;
};
