import { supabase } from './supabaseClient';
import sharp from 'sharp';

export const PARTICIPANT_AVATARS_BUCKET = 'participant-avatars';

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
	const { data: thumbnailData, error: thumbnailError } = await supabase.storage
		.from(PARTICIPANT_AVATARS_BUCKET)
		.upload(`${userId}/${participationId}-128.webp`, thumbnail, { contentType: 'image/webp' });
	const { data: mediumData, error: mediumError } = await supabase.storage
		.from(PARTICIPANT_AVATARS_BUCKET)
		.upload(`${userId}/${participationId}-512.webp`, medium, { contentType: 'image/webp' });
	const { data: fullData, error: fullError } = await supabase.storage
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
