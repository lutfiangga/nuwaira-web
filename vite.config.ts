import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		host: '127.0.0.1'
  },
  build: {
		minify: 'esbuild',
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				manualChunks: (id: string) => {
					const chunks = [
						{ match: ['leaflet'], name: 'vendor-leaflet' },
						{ match: ['quill'], name: 'vendor-quill' },
						{ match: ['/aos/'], name: 'vendor-aos' },
						{ match: ['xlsx'], name: 'vendor-xlsx' },
						{ match: ['drizzle-orm', 'postgres'], name: 'vendor-db' },
						{ match: ['bits-ui', 'svelte-sonner'], name: 'vendor-ui' },
						{ match: ['node_modules'], name: 'vendor' }
					];
					
					return chunks.find(chunk => chunk.match.some(m => id.includes(m)))?.name;
				}
			}
		}
	},
	ssr: {
		external: ['sharp']
	}
});
