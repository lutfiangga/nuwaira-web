import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/app/database';
import * as table from '$lib/app/database/schema';
import { hash, verify } from '@node-rs/argon2';
import { logDbError } from './db/safe-db';

/**
 * Melakukan hashing password menggunakan algoritma Argon2id.
 * @param password Password plaintext
 * @returns Password hash
 */
export async function hashPassword(password: string): Promise<string> {
	return await hash(password, {
		// parameter minimum yang direkomendasikan
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

/**
 * Memverifikasi kecocokan password plaintext dengan hash.
 * @param hash Password hash dari database
 * @param password Password plaintext dari input user
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
	return await verify(hash, password);
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

/**
 * Membuat token sesi acak yang aman secara kriptografi.
 */
export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

/**
 * Membuat sesi baru di database.
 * Token di-hash menggunakan SHA-256 sebelum disimpan.
 */
export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

/**
 * Memvalidasi token sesi.
 * - Memeriksa keberadaan sesi di database.
 * - Memeriksa apakah sesi sudah kadaluarsa.
 * - Memperpanjang sesi secara otomatis jika mendekati waktu habis (sliding window).
 */
export async function validateSessionToken(token: string) {
	try {
		const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
		const [result] = await db
			.select({
				// Sesuaikan kolom user yang ingin dikembalikan
				user: { id: table.user.id, username: table.user.username, roleId: table.user.roleId },
				session: table.session
			})
			.from(table.session)
			.innerJoin(table.user, eq(table.session.userId, table.user.id))
			.where(eq(table.session.id, sessionId));

		if (!result) {
			return { session: null, user: null };
		}
		const { session, user } = result;

		const sessionExpired = Date.now() >= session.expiresAt.getTime();
		if (sessionExpired) {
			await db.delete(table.session).where(eq(table.session.id, session.id));
			return { session: null, user: null };
		}

		const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
		if (renewSession) {
			session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
			await db
				.update(table.session)
				.set({ expiresAt: session.expiresAt })
				.where(eq(table.session.id, session.id));
		}

		return { session, user };
	} catch (error) {
		logDbError('auth.validateSessionToken', error);
		return { session: null, user: null };
	}
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

/**
 * Menghapus sesi berdasarkan ID (Logout).
 */
export async function invalidateSession(sessionId: string) {
	try {
		await db.delete(table.session).where(eq(table.session.id, sessionId));
	} catch (error) {
		logDbError('auth.invalidateSession', error);
	}
}

/**
 * Mengatur cookie sesi pada browser.
 */
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

/**
 * Menghapus cookie sesi dari browser.
 */
export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
