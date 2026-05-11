
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file || !(file instanceof File)) {
            return json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name);
        const fileName = `${randomUUID()}${ext}`;
        const uploadDir = 'static/uploads/news';
        
        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true });
        
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);

        // Return path relative to static (for public access)
        // Usually static files are served at root, so '/uploads/news/filename'
        const publicUrl = `/uploads/news/${fileName}`;

        console.log(`File uploaded: ${publicUrl}`);

        return json({ url: publicUrl });

    } catch (err) {
        console.error('Upload error:', err);
        return json({ error: 'Upload failed' }, { status: 500 });
    }
};
