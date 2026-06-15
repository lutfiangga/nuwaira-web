import type { LayoutServerLoad } from './$types';
import { ProgramService } from '$lib/app/modules/program/services/program.service';

export const load: LayoutServerLoad = async () => {
	const [publicNavigation, sharedProgramContent] = await Promise.all([
		ProgramService.getPublicNavigation(),
		ProgramService.getSharedProgramContent()
	]);
	return { publicNavigation, sharedProgramContent };
};
