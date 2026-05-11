<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Table,
		LayoutTemplate,
		Database,
		Shield,
		Lock,
		Fingerprint,
		KeyRound,
		Download,
		FileSpreadsheet,
		FileText,
		FileType
	} from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Core Features</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			The power tools that build this application.
		</p>
	</div>

	<!-- FormBuilder Deep Dive -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400"
			>
				<LayoutTemplate class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">FormBuilder</h2>
				<p class="text-muted-foreground">Schema Driven Forms</p>
			</div>
		</div>

		<p class="leading-7">
			We define forms using a JSON-like schema instead of writing repetitive HTML. The <code
				>FormBuilder</code
			> handles validation, layout, and submission automatically.
		</p>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>Supported Fields</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<ul class="grid grid-cols-2 gap-2 text-sm font-mono">
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							text
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							textarea
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							number
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							email
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-blue-500"></div>
							select
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-blue-500"></div>
							combobox
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-purple-500"></div>
							file (multiple)
						</li>
						<li class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-yellow-500"></div>
							custom
						</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card class="bg-slate-950 text-slate-50">
				<Card.CardHeader>
					<Card.CardTitle class="text-slate-50">Example Configuration</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<pre class="overflow-x-auto text-xs font-mono"><code
							>const schema = [
  {'{'} 
    type: 'grid', 
    columns: 2,
    children: [
      {'{'} name: 'username', type: 'text', label: 'User' {'}'},
      {'{'} name: 'role', type: 'select', options: [...] {'}'},
      {'{'} name: 'images', type: 'file', multiple: true {'}'} 
    ]
  {'}'}
];</code
						></pre>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<Separator />

	<!-- Middleware -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
				<Shield class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Middleware</h2>
				<p class="text-muted-foreground">Route protection made easy</p>
			</div>
		</div>

		<p class="leading-7">
			Middleware functions protect routes and manage authentication state. Import from <code
				>$lib/app/middleware</code
			>.
		</p>

		<div class="grid md:grid-cols-3 gap-6">
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>isLogin</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-2">
						Redirects to <code>/login</code> if not authenticated.
					</p>
					<pre
						class="text-xs bg-muted p-2 rounded font-mono overflow-x-auto">return isLogin(event);</pre>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>isLoginWithRole</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-2">Check login + specific roles.</p>
					<pre
						class="text-xs bg-muted p-2 rounded font-mono overflow-x-auto">return isLoginWithRole(event, ['admin']);</pre>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>isGuest</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-2">
						Redirects to <code>/panel/dashboard</code> if logged in.
					</p>
					<pre
						class="text-xs bg-muted p-2 rounded font-mono overflow-x-auto">return isGuest(event);</pre>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<Separator />

	<!-- Export Helper -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
				<Download class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Export Helper</h2>
				<p class="text-muted-foreground">Multi-format data export</p>
			</div>
		</div>

		<p class="leading-7">
			Export table data to CSV, Excel, or PDF with a single function call. Each route can specify
			which formats are available.
		</p>

		<div class="grid md:grid-cols-3 gap-6">
			<Card.Card>
				<Card.CardHeader class="flex flex-row items-center gap-2">
					<FileText class="h-6 w-6 text-green-500" />
					<Card.CardTitle>CSV</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Comma-separated values with proper escaping for special characters.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader class="flex flex-row items-center gap-2">
					<FileSpreadsheet class="h-6 w-6 text-emerald-500" />
					<Card.CardTitle>Excel</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Uses xlsx library if available, falls back to TSV format.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader class="flex flex-row items-center gap-2">
					<FileType class="h-6 w-6 text-rose-500" />
					<Card.CardTitle>PDF</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Opens print dialog for saving as PDF via browser.
					</p>
				</Card.CardContent>
			</Card.Card>
		</div>

		<Card.Card class="bg-slate-950 text-slate-50">
			<Card.CardHeader>
				<Card.CardTitle class="text-slate-50">Usage Example</Card.CardTitle>
			</Card.CardHeader>
			<Card.CardContent>
				<pre class="overflow-x-auto text-xs font-mono"><code
						>// In +page.svelte
function handleExport(format: ExportFormat) {'{'}
  ExportHelper.export(format, data, columns, 'filename');
{'}'}

// In template - choose available formats
&lt;DataTableToolbar 
  onExport={'{'}handleExport{'}'} 
  exportFormats={'{'}['csv', 'xlsx']{'}'}  // Only CSV and Excel
/&gt;</code
					></pre>
			</Card.CardContent>
		</Card.Card>
	</section>

	<Separator />

	<!-- Authentication Deep Dive -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400"
			>
				<Shield class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Authentication</h2>
				<p class="text-muted-foreground">Secure, Session-based Auth (Oslo & Argon2)</p>
			</div>
		</div>

		<p class="leading-7">
			We use a custom, robust authentication implementation that mirrors the best practices of <strong
				>Lucia Auth v3</strong
			>. Instead of a black-box library, we own the auth flow.
		</p>

		<div class="grid gap-6 md:grid-cols-3">
			<Card.Card>
				<Card.CardHeader>
					<Fingerprint class="h-8 w-8 mb-2 text-emerald-500" />
					<Card.CardTitle>Session Managed</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Sessions are stored in the database (`session` table) and linked to users. We use
						secure, HTTP-only cookies.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<KeyRound class="h-8 w-8 mb-2 text-amber-500" />
					<Card.CardTitle>Argon2 Hashing</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Passwords are never stored plainly. We use <code>Argon2id</code>, the winner of the
						Password Hashing Competition.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Lock class="h-8 w-8 mb-2 text-rose-500" />
					<Card.CardTitle>Type-Safe</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						The <code>event.locals.user</code> object is strongly typed in the SvelteKit hooks, giving
						you autocomplete everywhere.
					</p>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>
</div>
