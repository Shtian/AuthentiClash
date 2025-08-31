import { supabaseServerClient } from './supabaseClient';
import sharp from 'sharp';

export const PARTICIPANT_AVATARS_BUCKET = 'participant-avatars';
export const GAME_IMAGES_BUCKET = 'game-images';

export const uploadParticipantImage = async (
	imageUrl: string,
	userId: string,
	participationId: string
) => {
	// download image from url and resize+optimize before upload
	const response = await fetch(imageUrl);
	const originalImage = await response.arrayBuffer();

	const thumbnail = await sharp(originalImage)
		.resize({ width: 128, height: 128 })
		.webp({ quality: 90 })
		.toBuffer();
	const medium = await sharp(originalImage)
		.resize({ width: 512, height: 512 })
		.webp({ quality: 90 })
		.toBuffer();
	const full = await sharp(originalImage).webp({ quality: 90 }).toBuffer();

	// upload to supabase storage
	const { data: thumbnailData, error: thumbnailError } = await supabaseServerClient.storage
		.from(PARTICIPANT_AVATARS_BUCKET)
		.upload(`${userId}/${participationId}-128.webp`, thumbnail, { contentType: 'image/webp' });
	const { data: mediumData, error: mediumError } = await supabaseServerClient.storage
		.from(PARTICIPANT_AVATARS_BUCKET)
		.upload(`${userId}/${participationId}-512.webp`, medium, { contentType: 'image/webp' });
	const { data: fullData, error: fullError } = await supabaseServerClient.storage
		.from(PARTICIPANT_AVATARS_BUCKET)
		.upload(`${userId}/${participationId}.webp`, full, { contentType: 'image/webp' });

	if (thumbnailError || fullError || mediumError) {
		console.error(
			'Error uploading images:',
			thumbnailError?.message,
			mediumError?.message,
			fullError?.message
		);
		return { type: 'error', data: null, fullError };
	}

	return {
		type: 'success',
		data: {
			thumbnailPath: thumbnailData.path,
			fullPath: fullData.path,
			mediumPath: mediumData.path
		},
		error: null
	};
};

export const uploadGameImage = async (imageUrl: string, gameId: string | number) => {
	const response = await fetch(imageUrl);
	const originalImage = await response.arrayBuffer();

	const thumbnail = await sharp(originalImage)
		.resize({ width: 128, height: 128 })
		.webp({ quality: 90 })
		.toBuffer();
	const medium = await sharp(originalImage)
		.resize({ width: 512, height: 512 })
		.webp({ quality: 90 })
		.toBuffer();
	const full = await sharp(originalImage).webp({ quality: 90 }).toBuffer();

	// Store in the bucket root; include game id in the filename
	const baseName = `endgame-${gameId}`;

	const { data: thumbnailData, error: thumbnailError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}-128.webp`, thumbnail, { contentType: 'image/webp', upsert: true });
	const { data: mediumData, error: mediumError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}-512.webp`, medium, { contentType: 'image/webp', upsert: true });
	const { data: fullData, error: fullError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}.webp`, full, { contentType: 'image/webp', upsert: true });

	if (thumbnailError || mediumError || fullError) {
		console.error(
			'Error uploading game images:',
			thumbnailError?.message,
			mediumError?.message,
			fullError?.message
		);
		return { type: 'error', data: null, fullError } as const;
	}

	return {
		type: 'success',
		data: {
			thumbnailPath: thumbnailData.path,
			mediumPath: mediumData.path,
			fullPath: fullData.path
		},
		error: null
	} as const;
};

export const uploadGameImageFromBase64 = async (
	base64: string,
	gameId: string | number
) => {
	const originalImage = Buffer.from(base64, 'base64');

	const thumbnail = await sharp(originalImage)
		.resize({ width: 128, height: 128 })
		.webp({ quality: 90 })
		.toBuffer();
	const medium = await sharp(originalImage)
		.resize({ width: 512, height: 512 })
		.webp({ quality: 90 })
		.toBuffer();
	const full = await sharp(originalImage).webp({ quality: 90 }).toBuffer();

	const baseName = `endgame-${gameId}`;

	const { data: thumbnailData, error: thumbnailError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}-128.webp`, thumbnail, { contentType: 'image/webp', upsert: true });
	const { data: mediumData, error: mediumError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}-512.webp`, medium, { contentType: 'image/webp', upsert: true });
	const { data: fullData, error: fullError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}.webp`, full, { contentType: 'image/webp', upsert: true });

	if (thumbnailError || mediumError || fullError) {
		console.error(
			'Error uploading game images from base64:',
			thumbnailError?.message,
			mediumError?.message,
			fullError?.message
		);
		return { type: 'error', data: null, fullError } as const;
	}

	return {
		type: 'success',
		data: {
			thumbnailPath: thumbnailData.path,
			mediumPath: mediumData.path,
			fullPath: fullData.path
		},
		error: null
	} as const;
};
