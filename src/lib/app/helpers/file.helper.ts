import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { join, extname, normalize } from 'path';
import { error } from '@sveltejs/kit';

export interface FileValidationOptions {
    maxSize?: number; // dalam bytes
    allowedTypes?: string[];
}

/**
 * Helper untuk menangani operasi file secara aman.
 * Menangani validasi, penyimpanan, dan penghapusan file dengan perlindungan path traversal dan pengecekan tipe file.
 */
export class FileHelper {
    private static readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    private static readonly ALLOWED_DOC_TYPES = ['application/pdf'];

    // Gabungan tipe file yang diperbolehkan
    public static readonly ALLOWED_TYPES = [
        ...FileHelper.ALLOWED_IMAGE_TYPES,
        ...FileHelper.ALLOWED_DOC_TYPES
    ];

    /**
     * Memvalidasi file berdasarkan ukuran dan tipe MIME.
     * @param file File yang akan divalidasi
     * @param options Opsi validasi kustom (ukuran maksimal, tipe yang diizinkan)
     * @throws error(400) jika validasi gagal
     */
    static validate(file: File, options?: FileValidationOptions) {
        // 1. Cek apakah file ada dan memiliki konten
        if (!file || file.size === 0) {
            throw error(400, 'File kosong atau tidak ditemukan.');
        }

        const maxSize = options?.maxSize ?? this.DEFAULT_MAX_SIZE;
        const allowedTypes = options?.allowedTypes ?? this.ALLOWED_TYPES;

        // 2. Cek Ukuran
        if (file.size > maxSize) {
            const sizeInMB = maxSize / (1024 * 1024);
            throw error(400, `Ukuran file melebihi batas ${sizeInMB}MB.`);
        }

        // 3. Cek Tipe (MIME)
        if (!allowedTypes.includes(file.type)) {
            // Cek khusus untuk tipe berbahaya seperti zip/rar untuk pesan error yang lebih jelas
            if (file.type.includes('zip') || file.type.includes('compressed') || file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
                throw error(400, 'File kompresi (.zip, .rar) tidak diizinkan demi keamanan.');
            }
            throw error(400, `Tipe file '${file.type}' tidak diizinkan. Tipe yang diizinkan: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}.`);
        }

        // 4. Cek Ekstensi (Verifikasi ganda agar nama file sesuai dengan tipe)
        const ext = extname(file.name).toLowerCase();
        if (ext) {
            const isZip = ['.zip', '.rar', '.7z', '.tar', '.gz', '.exe', '.sh', '.bat'].includes(ext);
            if (isZip) {
                throw error(400, 'Keamanan: File eksekusi dan arsip dilarang keras.');
            }
        }
    }

    /**
     * Menyimpan file secara aman ke direktori static.
     * Menggunakan UUID untuk nama file guna mencegah konflik dan masalah keamanan.
     * 
     * @param file File yang akan disimpan
     * @param relativeUploadDir Direktori tujuan (relatif terhadap folder static)
     * @returns Path URL publik ke file tersebut
     */
    static async save(file: File, relativeUploadDir: string): Promise<string> {
        // Pastikan validasi dijalankan
        this.validate(file);

        // Mencegah path traversal pada directori tujuan
        // remove leading ../ to prevent going up from static
        const safeRelativeDir = normalize(relativeUploadDir).replace(/^(\.\.(\/|\\|$))+/, '');
        const targetDir = join('static', safeRelativeDir);

        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
        }

        // Generate nama file yang aman
        // Jangan percaya nama file dari user. Gunakan UUID + ekstensi yang valid dari tipe MIME jika memungkinkan.
        const ext = this.getExtensionFromType(file.type) || extname(file.name).toLowerCase();

        // Blokir ekstensi berbahaya jika lolos validasi tipe
        if (!ext || ['.php', '.html', '.js', '.exe', '.sh'].includes(ext)) {
            throw error(400, 'Ekstensi file tidak valid atau berbahaya.');
        }

        const filename = `${crypto.randomUUID()}${ext}`;
        const fullPath = join(targetDir, filename);

        const buffer = await file.arrayBuffer();
        writeFileSync(fullPath, Buffer.from(buffer));

        // Kembalikan path untuk penggunaan URL (misal: /uploads/users/abc.jpg)
        const urlPath = `/${safeRelativeDir}/${filename}`.replace(/\\/g, '/');
        return urlPath.replace('//', '/');
    }

    /**
     * Menghapus file dari sistem file secara aman.
     * @param path Path file yang akan dihapus (relatif atau absolut dari root web)
     */
    static delete(path: string | null) {
        if (!path) return;

        // Sanitasi path untuk mencegah traversal keluar dari folder static
        const relativePath = path.startsWith('/') ? path.slice(1) : path;

        // Cek Keamanan: pastikan kita tidak menghapus apapun di luar folder static
        const fullPath = join('static', relativePath);
        const resolvedPath = normalize(fullPath);

        if (existsSync(resolvedPath)) {
            try {
                unlinkSync(resolvedPath);
            } catch (e) {
                console.error(`Gagal menghapus file: ${resolvedPath}`, e);
            }
        }
    }

    private static getExtensionFromType(mimeType: string): string {
        switch (mimeType) {
            case 'image/jpeg': return '.jpg';
            case 'image/png': return '.png';
            case 'image/webp': return '.webp';
            case 'image/gif': return '.gif';
            case 'application/pdf': return '.pdf';
            default: return '';
        }
    }
}
