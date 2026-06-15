import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { ProgramService } from '$lib/app/modules/program/services/program.service';

const FaqItemSchema = z.object({
	question: z.string().min(1, 'Pertanyaan wajib diisi'),
	answer: z.string().min(1, 'Jawaban wajib diisi')
});

const BulkFaqSchema = z.object({
	faqs: z.array(FaqItemSchema)
});

export const load: PageServerLoad = async () => {
	const faqs = await ProgramService.getFaqs();
	return { faqs };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const faqsJson = formData.get('faqs')?.toString();

		if (!faqsJson) return fail(400, { message: 'Data FAQ kosong' });

		let parsed: unknown;
		try {
			parsed = JSON.parse(faqsJson);
		} catch {
			return fail(400, { message: 'Invalid JSON' });
		}

		const result = BulkFaqSchema.safeParse(parsed);
		if (!result.success) {
			return fail(400, {
				message: 'Validasi gagal',
				errors: result.error.flatten().fieldErrors
			});
		}

		try {
			await ProgramService.saveFaqs(result.data.faqs);
			return { success: true, message: 'FAQ berhasil disimpan' };
		} catch (err) {
			console.error('Save FAQs error:', err);
			return fail(500, { message: 'Gagal menyimpan FAQ' });
		}
	}
};
