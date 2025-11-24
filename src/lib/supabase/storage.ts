import { supabaseServerClient } from './supabaseClient';
import sharp from 'sharp';

export const PARTICIPANT_AVATARS_BUCKET = 'participant-avatars';
export const GAME_IMAGES_BUCKET = 'game-images';

interface UploadImageOptions {
	bucket: string;
	baseName: string;
	upsert?: boolean;
}

export const uploadImageFromBase64 = async (
	base64: string,
	{ bucket, baseName, upsert = true }: UploadImageOptions
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

	const uploadOpts = { contentType: 'image/webp', upsert } as const;

	const { data: thumbnailData, error: thumbnailError } = await supabaseServerClient.storage
		.from(bucket)
		.upload(`${baseName}-128.webp`, thumbnail, uploadOpts);
	const { data: mediumData, error: mediumError } = await supabaseServerClient.storage
		.from(bucket)
		.upload(`${baseName}-512.webp`, medium, uploadOpts);
	const { data: fullData, error: fullError } = await supabaseServerClient.storage
		.from(bucket)
		.upload(`${baseName}.webp`, full, uploadOpts);

	if (thumbnailError || mediumError || fullError) {
		console.error(
			'Error uploading images:',
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

export const uploadParticipantImage = async (
	base64: string,
	userId: string,
	participationId: string
) =>
	uploadImageFromBase64(base64, {
		bucket: PARTICIPANT_AVATARS_BUCKET,
		baseName: `${userId}/${participationId}`
	});

export const uploadParticipantImageFromUrl = async (
	url: string,
	userId: string,
	participationId: string
) => {
	const baseName = `${userId}/${participationId}`;
	const originalImageRes = await fetch(url);
	const originalImage = await originalImageRes.arrayBuffer().then(Buffer.from);

	const thumbnail = await sharp(originalImage)
		.resize({ width: 128, height: 128 })
		.webp({ quality: 90 })
		.toBuffer();
	const medium = await sharp(originalImage)
		.resize({ width: 512, height: 512 })
		.webp({ quality: 90 })
		.toBuffer();
	const full = await sharp(originalImage).webp({ quality: 90 }).toBuffer();

	const uploadOpts = { contentType: 'image/webp', upsert: true } as const;

	const { data: thumbnailData, error: thumbnailError } = await supabaseServerClient.storage
		.from(PARTICIPANT_AVATARS_BUCKET)
		.upload(`${baseName}-128.webp`, thumbnail, uploadOpts);
	const { data: mediumData, error: mediumError } = await supabaseServerClient.storage
		.from(PARTICIPANT_AVATARS_BUCKET)
		.upload(`${baseName}-512.webp`, medium, uploadOpts);
	const { data: fullData, error: fullError } = await supabaseServerClient.storage
		.from(PARTICIPANT_AVATARS_BUCKET)
		.upload(`${baseName}.webp`, full, uploadOpts);

	if (thumbnailError || mediumError || fullError) {
		console.error(
			'Error uploading images:',
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

export const uploadGameImage = async (base64: string, gameId: string | number) =>
	uploadImageFromBase64(base64, {
		bucket: GAME_IMAGES_BUCKET,
		baseName: `endgame-${gameId}`
	});

export const uploadGameImageFromUrl = async (url: string, gameId: string | number) => {
	const baseName = `endgame-${gameId}`;
	const originalImageRes = await fetch(url);
	const originalImage = await originalImageRes.arrayBuffer().then(Buffer.from);

	const thumbnail = await sharp(originalImage)
		.resize({ width: 128, height: 128 })
		.webp({ quality: 90 })
		.toBuffer();
	const medium = await sharp(originalImage)
		.resize({ width: 512, height: 512 })
		.webp({ quality: 90 })
		.toBuffer();
	const full = await sharp(originalImage).webp({ quality: 90 }).toBuffer();

	const uploadOpts = { contentType: 'image/webp', upsert: true } as const;

	const { data: thumbnailData, error: thumbnailError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}-128.webp`, thumbnail, uploadOpts);
	const { data: mediumData, error: mediumError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}-512.webp`, medium, uploadOpts);
	const { data: fullData, error: fullError } = await supabaseServerClient.storage
		.from(GAME_IMAGES_BUCKET)
		.upload(`${baseName}.webp`, full, uploadOpts);

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

// Wrapper functions that dispatch to the correct upload method based on IMAGE_GENERATOR
const imageGenerator = (process.env.IMAGE_GENERATOR || 'openai').toLowerCase();

export const uploadAvatarImage = async (
	imageData: string,
	userId: string,
	participationId: string
) => {
	if (imageGenerator === 'fal') {
		return uploadParticipantImageFromUrl(imageData, userId, participationId);
	}
	return uploadParticipantImage(imageData, userId, participationId);
};

export const uploadVictoryImage = async (imageData: string, gameId: string | number) => {
	if (imageGenerator === 'fal') {
		return uploadGameImageFromUrl(imageData, gameId);
	}
	return uploadGameImage(imageData, gameId);
};
