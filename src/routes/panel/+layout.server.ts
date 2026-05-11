import type { LayoutServerLoad } from './$types';
import { isLogin } from '$lib/app/middleware';

export const load: LayoutServerLoad = async (event) => {
    return isLogin(event);
};
