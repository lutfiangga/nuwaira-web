import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfig() {
	if (configured) return;
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		secure: true
	});
	configured = true;
}

export interface CloudinaryUploadResult {
	url: string;
	publicId: string;
	width: number;
	height: number;
	format: string;
	resourceType: string;
}

export class CloudinaryService {
	static async uploadFile(file: File, folder = 'uploads'): Promise<CloudinaryUploadResult> {
		ensureConfig();
		const buffer = Buffer.from(await file.arrayBuffer());
		return new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder,
					resource_type: 'image',
					format: 'webp',
					quality: 'auto',
					fetch_format: 'auto',
					flags: 'lossy',
					transformation: [
						{ quality: 'auto:good', fetch_format: 'auto' }
					]
				},
				(error, result) => {
					if (error) return reject(error);
					resolve({
						url: result!.secure_url,
						publicId: result!.public_id,
						width: result!.width,
						height: result!.height,
						format: result!.format,
						resourceType: result!.resource_type
					});
				}
			);
			stream.end(buffer);
		});
	}

	static async uploadUrl(url: string, folder = 'uploads'): Promise<CloudinaryUploadResult> {
		ensureConfig();
		const result = await cloudinary.uploader.upload(url, {
			folder,
			resource_type: 'image',
			format: 'webp',
			quality: 'auto',
			transformation: [
				{ quality: 'auto:good', fetch_format: 'auto' }
			]
		});
		return {
			url: result.secure_url,
			publicId: result.public_id,
			width: result.width,
			height: result.height,
			format: result.format,
			resourceType: result.resource_type
		};
	}

	static async uploadMultiple(files: File[], folder = 'uploads'): Promise<CloudinaryUploadResult[]> {
		return Promise.all(files.map(f => this.uploadFile(f, folder)));
	}

	static async delete(publicId: string, resourceType = 'image') {
		ensureConfig();
		return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
	}

	static getUrl(publicId: string, transforms?: Record<string, any>): string {
		ensureConfig();
		return cloudinary.url(publicId, { secure: true, ...transforms });
	}
}
