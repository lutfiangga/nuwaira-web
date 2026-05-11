<script lang="ts">
	import {
		ExternalLink,
		Layers,
		Box,
		Database,
		Palette,
		Shield,
		Map as MapIcon,
		FileText
	} from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	const dependencies = [
		{
			category: 'Core Framework',
			icon: Layers,
			items: [
				{ name: 'SvelteKit', url: 'https://kit.svelte.dev', desc: 'Web development framework' },
				{ name: 'Vite', url: 'https://vitejs.dev', desc: 'Next Generation Frontend Tooling' },
				{ name: 'TypeScript', url: 'https://www.typescriptlang.org', desc: 'Typed JavaScript' }
			]
		},
		{
			category: 'UI & Styling',
			icon: Palette,
			items: [
				{
					name: 'Tailwind CSS',
					url: 'https://tailwindcss.com',
					desc: 'Utility-first CSS framework'
				},
				{
					name: 'Shadcn Svelte',
					url: 'https://next.shadow-s.velte.dev',
					desc: 'Accessible component library'
				},
				{ name: 'Bits UI', url: 'https://bits-ui.com', desc: 'Headless UI primitives' },
				{ name: 'Lucide Svelte', url: 'https://lucide.dev', desc: 'Beautiful icons' },
				{ name: 'Quill', url: 'https://quilljs.com', desc: 'Rich Text Editor' }
			]
		},
		{
			category: 'Database & Backend',
			icon: Database,
			items: [
				{ name: 'Drizzle ORM', url: 'https://orm.drizzle.team', desc: 'Type-safe SQL ORM' },
				{
					name: 'Postgres.js',
					url: 'https://github.com/porsager/postgres',
					desc: 'Fast PostgreSQL client'
				},
				{ name: 'Zod', url: 'https://zod.dev', desc: 'Schema validation' }
			]
		},
		{
			category: 'Authentication',
			icon: Shield,
			items: [
				{ name: 'Lucia', url: 'https://lucia-auth.com', desc: 'Authentication library' },
				{ name: 'Oslo', url: 'https://oslojs.dev', desc: 'Crypto utilities' },
				{ name: 'Argon2', url: 'https://github.com/napi-rs/node-rs', desc: 'Password hashing' }
			]
		},
		{
			category: 'Features',
			icon: Box,
			items: [
				{ name: 'Leaflet', url: 'https://leafletjs.com', desc: 'Interactive maps' },
				{ name: 'XLSX', url: 'https://docs.sheetjs.com', desc: 'Spreadsheet parser' }
			]
		}
	];
</script>

<div class="space-y-8">
	<!-- Hero Section -->
	<div class="space-y-4">
		<h1
			class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-block"
		>
			Documentation
		</h1>
		<p class="leading-7 text-xl text-muted-foreground max-w-2xl">
			Welcome to the project documentation. This guide covers everything from installation to
			advanced module development.
		</p>
		<div class="flex gap-2">
			<Badge variant="secondary">Svelte 5</Badge>
			<Badge variant="outline">TypeScript</Badge>
		</div>
	</div>

	<!-- Dependencies Grid -->
	<div>
		<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6">
			Tech Stack & Dependencies
		</h2>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each dependencies as group}
				<Card.Card class="h-full hover:bg-accent/5 transition-colors">
					<Card.CardHeader>
						<div class="flex items-center gap-2 mb-2">
							<div class="p-2 bg-primary/10 rounded-lg text-primary">
								<group.icon class="h-5 w-5" />
							</div>
							<Card.CardTitle class="text-lg">{group.category}</Card.CardTitle>
						</div>
					</Card.CardHeader>
					<Card.CardContent>
						<ul class="space-y-3">
							{#each group.items as item}
								<li>
									<a
										href={item.url}
										target="_blank"
										class="group flex items-start justify-between hover:bg-muted p-2 -mx-2 rounded-md transition-colors"
									>
										<div>
											<span
												class="font-medium group-hover:text-primary transition-colors flex items-center gap-1"
											>
												{item.name}
												<ExternalLink
													class="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
												/>
											</span>
											<div class="text-xs text-muted-foreground line-clamp-1">{item.desc}</div>
										</div>
									</a>
								</li>
							{/each}
						</ul>
					</Card.CardContent>
				</Card.Card>
			{/each}
		</div>
	</div>
</div>
