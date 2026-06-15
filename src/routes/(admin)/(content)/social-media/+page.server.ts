import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { ProgramService } from '$lib/app/modules/program/services/program.service';

const SocialLinkSchema = z.object({
	platform: z.string().min(1, 'Platform wajib diisi'),
	url: z.string().min(1, 'URL wajib diisi'),
	iconKey: z.string().min(1, 'Icon wajib dipilih')
});

const BulkSocialLinkSchema = z.object({
	links: z.array(SocialLinkSchema)
});

export const load: PageServerLoad = async () => {
	const links = await ProgramService.getSocialLinks();
	return { links };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const linksJson = formData.get('links')?.toString();

		if (!linksJson) return fail(400, { message: 'Data social media kosong' });

		let parsed: unknown;
		try {
			parsed = JSON.parse(linksJson);
		} catch {
			return fail(400, { message: 'Invalid JSON' });
		}

		const result = BulkSocialLinkSchema.safeParse(parsed);
		if (!result.success) {
			return fail(400, {
				message: 'Validasi gagal',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.saveSocialLinks(result.data.links);
			return { success: true, message: 'Social media berhasil disimpan' };
		} catch (err) {
			console.error('Save Social Links error:', err);
			return fail(500, { message: 'Gagal menyimpan social media' });
		}
	}
};
