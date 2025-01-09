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
	sort_order: number;
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

export type BadgeActivity = {
	awarded_on: Date;
	badge: Pick<BadgeDTO, 'name' | 'image'>;
	player: {
		username: string;
		avatar_url: string;
	};
};

export type UnlockPlayerBadgeResponse = 'unlocked' | 'exists' | 'not unlocked';

export const getAllEnabledBadges = async (): Promise<SupabaseResponse<BadgeDTO[]>> => {
	const { data, error } = await supabaseServerClient
		.from('badges')
		.select('id, name, description, image, slug, enabled, secret, sort_order')
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

export const getGlobalBadgeUnlockStats = async (): Promise<
	SupabaseResponse<{
		[key: number]: number;
	}>
> => {
	const { data: badgeUnlocks, error: badgeUnlocksError } = await supabaseServerClient
		.from('player_badges')
		.select('badge_id');

	if (badgeUnlocksError !== null) {
		console.error('Error getting global badge unlock stats:', badgeUnlocksError.message);
		const r: SupabaseResponse<{
			[key: number]: number;
		}> = { type: 'error', data: null, error: badgeUnlocksError };
		return r;
	}

	// group by badge_id and count
	const badgeUnlocksCount: { [key: number]: number } = badgeUnlocks.reduce(
		(acc, curr) => {
			acc[curr.badge_id as number] = acc[curr.badge_id] ? acc[curr.badge_id] + 1 : 1;
			return acc;
		},
		{} as { [key: number]: number }
	);

	const successResponse: SupabaseResponse<{
		[key: number]: number;
	}> = {
		type: 'success',
		data: badgeUnlocksCount,
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

	if (badgeRes.type === 'error') {
		return {
			type: 'error',
			data: null,
			error: badgeRes.error
		};
	}

	const userBadges = await getBadgesByUserId(userId);

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

export const getBadgeActivity = async (
	limit: number = 10,
	skip: number = 0
): Promise<SupabaseResponse<{ activity: BadgeActivity[]; count: number }>> => {
	const {
		data: badge_activity,
		count,
		error
	} = await supabaseServerClient
		.from('player_badges')
		.select('awarded_on, badges (id, name, secret, image), profiles(id, username, avatar_url)', {
			count: 'exact'
		})
		.order('awarded_on', { ascending: false })
		.range(skip, skip + limit - 1);
	if (error !== null) {
		console.error('Error getting badge activity:', error.message);
		const r: SupabaseResponse<BadgeActivity[]> = { type: 'error', data: null, error };
		return r;
	}

	const activity: BadgeActivity[] = badge_activity.map(mapToBadgeActivity);

	return { type: 'success', data: { activity, count: count || 0 }, error: null };
};

const mapToBadgeActivity = (data: any) => {
	const activity: BadgeActivity = {
		awarded_on: new Date(data.awarded_on),
		badge: {
			name: data.badges.secret ? 'Secret badge' : data.badges.name,
			image: data.badges.secret
				? 'https://mzuhtoiuhpkczppcdwza.supabase.co/storage/v1/object/public/badges/secret-trophy.webp'
				: data.badges.image
		},
		player: {
			username: data.profiles.username || 'Anonymous',
			avatar_url:
				data.profiles.avatar_url ||
				`https://api.dicebear.com/8.x/adventurer/svg?size=128&seed=${data.profiles.id.substring(
					0,
					8
				)}`
		}
	};

	return activity;
};

const mapToBadge = (data: any) => {
	const badgeDTO: BadgeDTO = {
		id: data.id,
		name: data.name,
		description: data.description,
		image: data.image,
		slug: data.slug,
		enabled: data.enabled,
		secret: data.secret,
		sort_order: data.sort_order
	};

	return badgeDTO;
};

const mapToPlayerBadge = (data: any) => {
	const playerBadgesDTO: PlayerBadgesDTO = {
		player_id: data.player_id,
		badge_id: data.badge_id,
		awarded_on: data.awarded_on
	};

	return playerBadgesDTO;
};
