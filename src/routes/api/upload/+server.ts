import { json } from '@sveltejs/kit';
import { uploadCloudinaryImage } from '$lib/app/server/cloudinary';

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file || !(file instanceof File) || file.size === 0) {
			return json({ error: 'Tidak ada file yang diupload' }, { status: 400 });
		}

		const result = await uploadCloudinaryImage(file, 'editor-uploads');

		return json({ url: result.url });
	} catch (error) {
		console.error('Upload error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Gagal mengupload gambar' },
			{ status: 500 }
		);
	}
}
