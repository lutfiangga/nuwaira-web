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
			const formatted = result.error.format();
			const linkErrors: Record<number, Record<string, string>> = {};

			const items = (formatted.links as unknown as Record<string, unknown>) ?? {};
			for (const [key, val] of Object.entries(items)) {
				const idx = Number(key);
				if (Number.isNaN(idx) || typeof val !== 'object' || val === null) continue;
				const fieldErrors = val as Record<string, { _errors?: string[] }>;
				linkErrors[idx] = {};
				for (const [field, err] of Object.entries(fieldErrors)) {
					if (field === '_errors') continue;
					if (err?._errors?.[0]) linkErrors[idx][field] = err._errors[0];
				}
			}

			console.error('Social media validation errors:', JSON.stringify(linkErrors, null, 2));

			return fail(400, {
				message: 'Validasi gagal',
				linkErrors
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
