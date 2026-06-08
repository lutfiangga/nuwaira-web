import { createHash } from 'node:crypto';
import { env } from '$env/dynamic/private';
import sharp from 'sharp';

interface CloudinaryUploadResponse {
	secure_url?: string;
	public_id?: string;
	error?: {
		message?: string;
	};
}

interface CompressOptions {
	maxWidth?: number;
	maxHeight?: number;
	quality?: number;
}

const DEFAULT_FOLDER = 'bootcamp-students';
const DEFAULT_COMPRESS: CompressOptions = {
	maxWidth: 960,
	maxHeight: 960,
	quality: 80
};

function getCloudinaryConfig() {
	const cloudName = env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
	const apiKey = env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
	const apiSecret = env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;
	const folderPrefix = env.CLOUDINARY_FOLDER_PREFIX || process.env.CLOUDINARY_FOLDER_PREFIX || '';

	if (!cloudName || !apiKey || !apiSecret) {
		throw new Error('Cloudinary environment variables are not configured');
	}

	return { cloudName, apiKey, apiSecret, folderPrefix };
}

function normalizeFolderPart(value: string) {
	return value.trim().replace(/^\/+|\/+$/g, '');
}

function buildFolder(prefix: string, folder: string) {
	return [prefix, folder].map(normalizeFolderPart).filter(Boolean).join('/');
}

function signUploadParams(params: Record<string, string>, apiSecret: string) {
	const payload = Object.keys(params)
		.sort()
		.map((key) => `${key}=${params[key]}`)
		.join('&');

	return createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

export async function compressImageToWebp(
	file: File,
	options: CompressOptions = {}
): Promise<File> {
	if (!file.type.startsWith('image/')) {
		throw new Error('File harus berupa gambar');
	}
	if (file.type === 'image/gif') {
		throw new Error('GIF tidak didukung');
	}

	const { maxWidth = DEFAULT_COMPRESS.maxWidth, maxHeight = DEFAULT_COMPRESS.maxHeight, quality = DEFAULT_COMPRESS.quality } = options;

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const webpBuffer = await sharp(buffer)
		.resize({
			width: maxWidth,
			height: maxHeight,
			fit: 'inside',
			withoutEnlargement: true
		})
		.webp({ quality })
		.toBuffer();

	const name = `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.webp`;
	return new File([new Uint8Array(webpBuffer)], name, { type: 'image/webp' });
}

export function extractPublicIdFromUrl(url: string): string | null {
	try {
		const parsed = new URL(url);
		const match = parsed.pathname.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
		if (!match) return null;
		return match[1];
	} catch {
		return null;
	}
}

export async function deleteCloudinaryImage(urlOrPublicId: string) {
	const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

	const publicId = urlOrPublicId.startsWith('http')
		? extractPublicIdFromUrl(urlOrPublicId)
		: urlOrPublicId;

	if (!publicId) {
		throw new Error('Could not extract public_id from URL');
	}

	const timestamp = Math.floor(Date.now() / 1000).toString();
	const signature = createHash('sha1')
		.update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
		.digest('hex');

	const formData = new FormData();
	formData.append('public_id', publicId);
	formData.append('api_key', apiKey);
	formData.append('timestamp', timestamp);
	formData.append('signature', signature);

	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
		{ method: 'POST', body: formData }
	);

	const result = await response.json();
	if (result.result !== 'ok') {
		console.warn('Failed to delete image from Cloudinary:', result);
	}
}

export async function uploadCloudinaryImage(
	file: File,
	folder = DEFAULT_FOLDER,
	compressOptions: CompressOptions = {}
) {
	const compressed = await compressImageToWebp(file, compressOptions);

	const { cloudName, apiKey, apiSecret, folderPrefix } = getCloudinaryConfig();
	const uploadFolder = buildFolder(folderPrefix, folder);
	const timestamp = Math.floor(Date.now() / 1000).toString();
	const signature = signUploadParams({ folder: uploadFolder, timestamp }, apiSecret);

	const formData = new FormData();
	formData.append('file', compressed, compressed.name);
	formData.append('api_key', apiKey);
	formData.append('timestamp', timestamp);
	formData.append('folder', uploadFolder);
	formData.append('signature', signature);

	const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
		method: 'POST',
		body: formData
	});

	const result = (await response.json()) as CloudinaryUploadResponse;
	if (!response.ok || !result.secure_url) {
		throw new Error(result.error?.message || 'Failed to upload image to Cloudinary');
	}

	return {
		url: result.secure_url,
		publicId: result.public_id ?? null
	};
}
