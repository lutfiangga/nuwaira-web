import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync } from 'node:crypto';
import { env } from '$env/dynamic/private';

const ALGORITHM = 'aes-256-gcm';
const VERSION = 'v1';
const KEY_DERIVATION_SALT = 'nuwaira-sensitive-data-v1';

function getSecretKey() {
	const secret = env.SECRET_KEY?.trim();

	if (!secret || secret.length < 32) {
		throw new Error('SECRET_KEY harus diisi minimal 32 karakter');
	}

	return scryptSync(secret, KEY_DERIVATION_SALT, 32);
}

export function encryptSensitiveValue(value: string) {
	const iv = randomBytes(12);
	const cipher = createCipheriv(ALGORITHM, getSecretKey(), iv);
	const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();

	return [
		VERSION,
		iv.toString('base64url'),
		authTag.toString('base64url'),
		encrypted.toString('base64url')
	].join('.');
}

export function decryptSensitiveValue(payload: string) {
	const [version, ivValue, authTagValue, encryptedValue] = payload.split('.');

	if (version !== VERSION || !ivValue || !authTagValue || !encryptedValue) {
		throw new Error('Format data terenkripsi tidak valid');
	}

	const decipher = createDecipheriv(ALGORITHM, getSecretKey(), Buffer.from(ivValue, 'base64url'));
	decipher.setAuthTag(Buffer.from(authTagValue, 'base64url'));

	return Buffer.concat([
		decipher.update(Buffer.from(encryptedValue, 'base64url')),
		decipher.final()
	]).toString('utf8');
}

export function createSensitiveIndex(value: string) {
	return createHmac('sha256', getSecretKey()).update(value.trim()).digest('hex');
}
