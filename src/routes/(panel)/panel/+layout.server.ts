import type { LayoutServerLoad } from './$types';
import { getAccessProfileFromEvent, isLogin } from '$lib/app/middleware';
import { RbacService } from '$lib/app/modules/rbac/services/rbac.service';

export const load: LayoutServerLoad = async (event) => {
	const base = isLogin(event);
	const accessProfile = await getAccessProfileFromEvent(event);
	const panelMenu = RbacService.getVisiblePanelMenus(accessProfile);

	return {
		...base,
		accessProfile,
		panelMenu
	};
};
