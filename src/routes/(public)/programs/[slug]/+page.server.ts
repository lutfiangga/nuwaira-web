import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ProgramService } from '$lib/app/modules/program/services/program.service';

export const load: PageServerLoad = async ({ params }) => {
	const program = await ProgramService.getPublicProgramBySlug(params.slug);
	if (!program) error(404, 'Program tidak ditemukan');
	return { program };
};
