import { redirect, type RequestEvent } from '@sveltejs/kit';

/**
 * Middleware untuk memeriksa status login pengguna.
 * Jika pengguna belum login, akan diarahkan otomatis ke halaman login.
 * 
 * @param event RequestEvent dari SvelteKit
 * @returns Object user jika login berhasil
 */
export function isLogin(event: RequestEvent) {
    if (!event.locals.user) {
        redirect(302, '/login');
    }
    return {
        user: event.locals.user
    };
}

/**
 * Middleware untuk otorisasi berbasis peran (RBAC).
 * Memeriksa login dan apakah role pengguna termasuk dalam daftar yang diizinkan.
 * 
 * @param event RequestEvent
 * @param allowedRoles Daftar role yang diizinkan mengakses
 */
export function isLoginWithRole(event: RequestEvent, allowedRoles: string[]) {
    if (!event.locals.user) {
        redirect(302, '/login');
    }

    const userRole = event.locals.user.roleId;
    if (!allowedRoles.includes(userRole)) {
        redirect(302, '/panel/dashboard');
    }

    return {
        user: event.locals.user
    };
}

/**
 * Middleware khusus tamu (Guest).
 * Digunakan untuk halaman seperti Login/Register.
 * Jika pengguna sudah login, akan diarahkan ke Dashboard.
 */
export function isGuest(event: RequestEvent) {
    if (event.locals.user) {
        redirect(302, '/panel/dashboard');
    }
    return {};
}
