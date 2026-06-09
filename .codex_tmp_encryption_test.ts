import {
	createSensitiveIndex,
	decryptSensitiveValue,
	encryptSensitiveValue
} from './src/lib/app/server/encryption';

const nik = '3273010101010001';
const encrypted = encryptSensitiveValue(nik);
const decrypted = decryptSensitiveValue(encrypted);
const indexA = createSensitiveIndex(nik);
const indexB = createSensitiveIndex(nik);

if (decrypted !== nik || encrypted.includes(nik) || indexA !== indexB) {
	throw new Error('Encryption round-trip failed');
}

console.log('ENCRYPTION_ROUND_TRIP_OK');
