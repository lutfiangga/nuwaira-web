import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_PATH = join(
	__dirname, '..', '..',
	'node_modules', '@thesvg', 'icons', 'dist'
);

function slugToLabel(slug: string) {
	return slug
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase())
		.replace(/\b\w{1,2}\b/g, (c) => c.toLowerCase())
		.trim();
}

type IconItem = { value: string; label: string; iconKey: string; svg?: string };

let cache: IconItem[] | null = null;

export function getAllThesvgIcons(): IconItem[] {
	if (cache) return cache;

	let slugs: string[];
	try {
		const files = readdirSync(DIST_PATH);
		slugs = files
			.filter((f) => f.endsWith('.js') && f !== 'index.js' && f !== 'types.js')
			.map((f) => f.replace(/\.js$/, ''));
	} catch {
		return [];
	}

	const svgRegex = /export const svg = `([\s\S]*?)`;/;

	cache = slugs.map((slug) => {
		let svg: string | undefined;
		try {
			const filePath = join(DIST_PATH, `${slug}.js`);
			const content = readFileSync(filePath, 'utf-8');
			const match = content.match(svgRegex);
			if (match) svg = match[1];
		} catch { /* ignore */ }

		return {
			value: slug,
			label: slugToLabel(slug),
			iconKey: slug,
			...(svg ? { svg } : {})
		};
	});

	return cache;
}
