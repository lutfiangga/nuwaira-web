import type { LayoutServerLoad } from './$types';
import { BrandSettingService } from '$lib/app/modules/brand-setting/services/brand-setting.service';

export const load: LayoutServerLoad = async (event) => {
    const brand = await BrandSettingService.get();
    return {
        user: event.locals.user,
        session: event.locals.session,
        brand
    };
};
