import type { PageServerLoad } from './$types';
import { OutletService } from '$lib/app/modules/outlet/services/outlet.service';

export const load: PageServerLoad = async () => {
    const outlets = await OutletService.getAll();

    // Filter outlets that have valid coordinates
    const outletsWithCoordinates = outlets.filter(
        outlet => outlet.latitude != null && outlet.longitude != null
    );

    return { outlets: outletsWithCoordinates };
};
