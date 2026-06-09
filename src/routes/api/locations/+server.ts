import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { LocationService } from '$lib/app/services/location.service';

export const GET: RequestHandler = async ({ url }) => {
	const level = url.searchParams.get('level');
	const parentId = url.searchParams.get('parentId')?.trim() ?? '';

	switch (level) {
		case 'provinces':
			return json(await LocationService.getProvinces());
		case 'regencies':
			return json(parentId ? await LocationService.getCities(parentId) : []);
		case 'districts':
			return json(parentId ? await LocationService.getDistricts(parentId) : []);
		case 'villages':
			return json(parentId ? await LocationService.getVillages(parentId) : []);
		default:
			return json({ message: 'Level lokasi tidak valid' }, { status: 400 });
	}
};
