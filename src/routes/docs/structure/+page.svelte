<script lang="ts">
	import {
		FileCode,
		Database,
		KeyRound,
		LayoutTemplate,
		Box,
		Server,
		Globe,
		Lock,
		Wrench,
		Type,
		Table,
		Shield,
		FolderTree,
		Download
	} from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="space-y-8">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Folder Structure</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			A deep dive into how `Velaris` is organized.
		</p>
	</div>

	<!-- Folder Tree -->
	<div class="space-y-6">
		<h2 class="text-3xl font-semibold tracking-tight border-b pb-2 flex items-center gap-2">
			<FolderTree class="h-7 w-7 text-green-500" />
			Project Tree
		</h2>

		<Card.Card class="overflow-hidden">
			<Card.CardContent class="pt-6 pb-4">
				<div class="font-mono text-sm space-y-0.5">
					<!-- Root -->
					<div class="flex items-center gap-2 font-bold text-primary">
						<FolderTree class="h-4 w-4 text-amber-500" />
						<span>Main/</span>
					</div>

					<!-- src -->
					<div class="ml-4 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<FolderTree class="h-4 w-4 text-amber-500" />
						<span class="font-semibold">src/</span>
					</div>

					<!-- lib -->
					<div class="ml-8 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<FolderTree class="h-4 w-4 text-blue-500" />
						<span class="font-semibold">lib/</span>
					</div>

					<!-- app -->
					<div class="ml-12 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Box class="h-4 w-4 text-purple-500" />
						<span class="font-semibold">app/</span>
						<span class="text-xs text-muted-foreground ml-2">Core business logic</span>
					</div>

					<!-- database -->
					<div class="ml-16 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Database class="h-4 w-4 text-green-500" />
						<span>database/</span>
						<span class="text-xs text-muted-foreground ml-2">Drizzle ORM</span>
					</div>

					<!-- helpers -->
					<div class="ml-16 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Wrench class="h-4 w-4 text-orange-500" />
						<span>helpers/</span>
						<span class="text-xs text-muted-foreground ml-2">Export, State utils</span>
					</div>

					<!-- middleware -->
					<div class="ml-16 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Shield class="h-4 w-4 text-red-500" />
						<span>middleware/</span>
						<span class="text-xs text-muted-foreground ml-2">Auth guards</span>
					</div>

					<!-- modules -->
					<div class="ml-16 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<LayoutTemplate class="h-4 w-4 text-cyan-500" />
						<span class="font-semibold">modules/</span>
						<span class="text-xs text-muted-foreground ml-2">Feature modules</span>
					</div>

					<!-- module items -->
					<div class="ml-20 flex items-center gap-2">
						<span class="text-muted-foreground">└──</span>
						<Box class="h-3 w-3 text-slate-400" />
						<span class="text-muted-foreground">user/, product/, category/, outlet/</span>
					</div>

					<!-- server -->
					<div class="ml-16 flex items-center gap-2">
						<span class="text-muted-foreground">└──</span>
						<Lock class="h-4 w-4 text-rose-500" />
						<span>server/</span>
						<span class="text-xs text-muted-foreground ml-2">Auth logic</span>
					</div>

					<!-- components -->
					<div class="ml-12 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<LayoutTemplate class="h-4 w-4 text-orange-500" />
						<span class="font-semibold">components/</span>
					</div>

					<div class="ml-16 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Box class="h-3 w-3 text-slate-400" />
						<span>ui/</span>
						<span class="text-xs text-muted-foreground ml-2">Shadcn primitives</span>
					</div>

					<div class="ml-16 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<FileCode class="h-3 w-3 text-pink-500" />
						<span>form-builder/</span>
						<span class="text-xs text-muted-foreground ml-2">Dynamic forms</span>
					</div>

					<div class="ml-16 flex items-center gap-2">
						<span class="text-muted-foreground">└──</span>
						<Table class="h-3 w-3 text-yellow-500" />
						<span>custom-table/</span>
						<span class="text-xs text-muted-foreground ml-2">DataTable</span>
					</div>

					<!-- types & utils -->
					<div class="ml-12 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Type class="h-4 w-4 text-blue-400" />
						<span>types/</span>
					</div>

					<div class="ml-12 flex items-center gap-2">
						<span class="text-muted-foreground">└──</span>
						<FileCode class="h-4 w-4 text-slate-500" />
						<span>utils.ts</span>
					</div>

					<!-- routes -->
					<div class="ml-8 flex items-center gap-2">
						<span class="text-muted-foreground">└──</span>
						<Globe class="h-4 w-4 text-green-500" />
						<span class="font-semibold">routes/</span>
					</div>

					<!-- panel -->
					<div class="ml-12 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Shield class="h-4 w-4 text-blue-500" />
						<span class="font-semibold text-blue-600 dark:text-blue-400">panel/</span>
						<span class="text-xs text-muted-foreground ml-2">Protected routes</span>
					</div>

					<div class="ml-16 flex items-center gap-2 text-muted-foreground">
						<span>└──</span>
						<span class="text-xs"
							>dashboard/, users/, products/, categories/, outlets/, outlet-map/</span
						>
					</div>

					<!-- public routes -->
					<div class="ml-12 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Lock class="h-4 w-4 text-red-500" />
						<span>login/</span>
						<span class="text-xs text-muted-foreground ml-2">Public</span>
					</div>

					<div class="ml-12 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<Server class="h-4 w-4 text-yellow-500" />
						<span>api/</span>
					</div>

					<div class="ml-12 flex items-center gap-2">
						<span class="text-muted-foreground">└──</span>
						<FileCode class="h-4 w-4 text-cyan-500" />
						<span>docs/</span>
					</div>

					<!-- static -->
					<div class="ml-4 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<FolderTree class="h-4 w-4 text-amber-500" />
						<span class="font-semibold">static/</span>
					</div>

					<div class="ml-8 flex items-center gap-2">
						<span class="text-muted-foreground">└──</span>
						<Download class="h-4 w-4 text-emerald-500" />
						<span>uploads/</span>
						<span class="text-xs text-muted-foreground ml-2">products/, users/</span>
					</div>

					<!-- config files -->
					<div class="ml-4 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<FileCode class="h-4 w-4 text-slate-400" />
						<span class="text-muted-foreground">drizzle.config.ts</span>
					</div>

					<div class="ml-4 flex items-center gap-2">
						<span class="text-muted-foreground">├──</span>
						<FileCode class="h-4 w-4 text-slate-400" />
						<span class="text-muted-foreground">svelte.config.js</span>
					</div>

					<div class="ml-4 flex items-center gap-2">
						<span class="text-muted-foreground">└──</span>
						<FileCode class="h-4 w-4 text-slate-400" />
						<span class="text-muted-foreground">package.json</span>
					</div>
				</div>
			</Card.CardContent>
		</Card.Card>
	</div>

	<div class="space-y-6">
		<h2 class="text-3xl font-semibold tracking-tight border-b pb-2">src/lib</h2>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- src/lib/app (Core Logic) -->
			<Card.Card class="h-full">
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<Box class="h-6 w-6 text-blue-500" />
						<Card.CardTitle>app/</Card.CardTitle>
					</div>
					<Card.CardDescription>The business logic core.</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent class="space-y-4">
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Database class="h-4 w-4 mt-1 text-green-500" />
							<div>
								<span class="font-bold">database/</span>
								<p class="text-xs text-muted-foreground">
									Drizzle connection & unified schema exports.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<LayoutTemplate class="h-4 w-4 mt-1 text-orange-500" />
							<div>
								<span class="font-bold">modules/</span>
								<p class="text-xs text-muted-foreground">
									Feature-based modules (User, Product, Outlet). Each contains `models/`,
									`services/`, `requests/`, and `forms/`.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Shield class="h-4 w-4 mt-1 text-red-500" />
							<div>
								<span class="font-bold">middleware/</span>
								<p class="text-xs text-muted-foreground">
									Auth middleware: <code>isLogin</code>, <code>isLoginWithRole</code>,
									<code>isGuest</code>.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Download class="h-4 w-4 mt-1 text-cyan-500" />
							<div>
								<span class="font-bold">helpers/</span>
								<p class="text-xs text-muted-foreground">
									Utility classes: <code>ExportHelper</code>, <code>TableState</code>,
									<code>CrudState</code>.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<KeyRound class="h-4 w-4 mt-1 text-purple-500" />
							<div>
								<span class="font-bold">server/auth.ts</span>
								<p class="text-xs text-muted-foreground">
									Custom authentication logic (Oslo + Argon2). Handles session cookies & hashing.
								</p>
							</div>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>

			<!-- src/lib/components (UI) -->
			<Card.Card class="h-full">
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<LayoutTemplate class="h-6 w-6 text-orange-500" />
						<Card.CardTitle>components/</Card.CardTitle>
					</div>
					<Card.CardDescription>Reusable UI elements.</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent class="space-y-4">
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<LayoutTemplate class="h-4 w-4 mt-1 text-slate-500" />
							<div>
								<span class="font-bold">ui/</span>
								<p class="text-xs text-muted-foreground">
									Shadcn Svelte primitives (Button, Card, Input).
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<FileCode class="h-4 w-4 mt-1 text-pink-500" />
							<div>
								<span class="font-bold">form-builder/</span>
								<p class="text-xs text-muted-foreground">
									Schema-driven form generator with file upload support.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Table class="h-4 w-4 mt-1 text-yellow-500" />
							<div>
								<span class="font-bold">custom-table/</span>
								<p class="text-xs text-muted-foreground">
									DataTable with sorting, pagination, filtering, bulk actions & export.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Globe class="h-4 w-4 mt-1 text-emerald-500" />
							<div>
								<span class="font-bold">location-selector.svelte</span>
								<p class="text-xs text-muted-foreground">
									Indonesia region picker (Prov/City/District) using `emsifa.com` API.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Globe class="h-4 w-4 mt-1 text-blue-400" />
							<div>
								<span class="font-bold">location-search.svelte</span>
								<p class="text-xs text-muted-foreground">Google Maps based location picker.</p>
							</div>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>

			<!-- src/lib/utils & types -->
			<Card.Card class="h-full md:col-span-2">
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<Wrench class="h-6 w-6 text-slate-500" />
						<Card.CardTitle>Utilities & Types</Card.CardTitle>
					</div>
					<Card.CardDescription>Global helpers and definitions.</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent class="grid md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Wrench class="h-4 w-4 mt-1 text-indigo-500" />
							<div>
								<span class="font-bold">utils.ts</span>
								<p class="text-xs text-muted-foreground">
									Contains `cn()` helper for merging Tailwind classes safely.
								</p>
							</div>
						</div>
					</div>
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Type class="h-4 w-4 mt-1 text-red-500" />
							<div>
								<span class="font-bold">types/</span>
								<p class="text-xs text-muted-foreground">Global TypeScript definitions.</p>
								<ul class="list-disc list-inside text-[10px] text-muted-foreground ml-1 mt-1">
									<li><code>form-builder.ts</code>: Form schema types</li>
									<li><code>data-table.ts</code>: Table structure types</li>
								</ul>
							</div>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>
		</div>
	</div>

	<div class="space-y-6">
		<h2 class="text-3xl font-semibold tracking-tight border-b pb-2">src/routes</h2>

		<div class="grid gap-6">
			<!-- src/routes (Pages) -->
			<Card.Card class="h-full">
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<Globe class="h-6 w-6 text-green-500" />
						<Card.CardTitle>routes/</Card.CardTitle>
					</div>
					<Card.CardDescription>SvelteKit file-based routing.</Card.CardDescription>
				</Card.CardHeader>
				<Card.CardContent class="grid md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Shield class="h-4 w-4 mt-1 text-blue-500" />
							<div>
								<span class="font-bold">panel/</span>
								<p class="text-xs text-muted-foreground">
									Protected admin panel. Uses <code>isLogin</code> middleware. Contains dashboard, users,
									products, categories, outlets, outlet-map, settings.
								</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<Lock class="h-4 w-4 mt-1 text-red-500" />
							<div>
								<span class="font-bold">login/ & logout/</span>
								<p class="text-xs text-muted-foreground">Public authentication pages.</p>
							</div>
						</div>
					</div>
					<div class="space-y-2">
						<div class="flex items-start gap-2">
							<Server class="h-4 w-4 mt-1 text-yellow-500" />
							<div>
								<span class="font-bold">api/</span>
								<p class="text-xs text-muted-foreground">Internal API endpoints returning JSON.</p>
							</div>
						</div>
						<div class="flex items-start gap-2">
							<FileCode class="h-4 w-4 mt-1 text-cyan-500" />
							<div>
								<span class="font-bold">docs/</span>
								<p class="text-xs text-muted-foreground">This documentation site!</p>
							</div>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>

			<!-- Panel Routes Detail -->
			<Card.Card>
				<Card.CardHeader>
					<div class="flex items-center gap-2">
						<LayoutTemplate class="h-6 w-6 text-blue-500" />
						<Card.CardTitle>panel/ Routes</Card.CardTitle>
					</div>
					<Card.CardDescription
						>All protected admin routes under /panel prefix.</Card.CardDescription
					>
				</Card.CardHeader>
				<Card.CardContent>
					<div class="grid md:grid-cols-3 gap-4 text-sm">
						<div class="space-y-1">
							<div class="font-medium">/panel/dashboard</div>
							<p class="text-xs text-muted-foreground">Main dashboard & settings</p>
						</div>
						<div class="space-y-1">
							<div class="font-medium">/panel/users</div>
							<p class="text-xs text-muted-foreground">User management with photo upload</p>
						</div>
						<div class="space-y-1">
							<div class="font-medium">/panel/products</div>
							<p class="text-xs text-muted-foreground">Products with multiple images</p>
						</div>
						<div class="space-y-1">
							<div class="font-medium">/panel/categories</div>
							<p class="text-xs text-muted-foreground">Category management</p>
						</div>
						<div class="space-y-1">
							<div class="font-medium">/panel/outlets</div>
							<p class="text-xs text-muted-foreground">Outlet CRUD with location picker</p>
						</div>
						<div class="space-y-1">
							<div class="font-medium">/panel/outlet-map</div>
							<p class="text-xs text-muted-foreground">Interactive outlet map view</p>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>
		</div>
	</div>
</div>
