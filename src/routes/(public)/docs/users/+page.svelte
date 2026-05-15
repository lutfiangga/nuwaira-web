<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Users,
		Database,
		Code2,
		Search,
		FileDown,
		Shield,
		UserPlus,
		Folder,
		FolderOpen,
		FileCode
	} from '@lucide/svelte';
</script>

<div class="space-y-12">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Users Module</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			User management system with secure password handling and role-based access.
		</p>
	</div>

	<!-- Features Overview -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400"
			>
				<Users class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Features</h2>
				<p class="text-muted-foreground">What's included in the module</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<UserPlus class="h-5 w-5" />
						User Management
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Complete user lifecycle management:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li>Create users with username, email, and password</li>
						<li>Edit user profiles (name, age, email)</li>
						<li>Delete users individually or in bulk</li>
						<li>Separate schemas for create/edit operations</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Shield class="h-5 w-5" />
						Security
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						Secure password handling:
					</p>
					<ul class="list-disc list-inside text-sm space-y-1 text-muted-foreground">
						<li><strong>Argon2:</strong> Industry-standard password hashing</li>
						<li><strong>Create only:</strong> Password field only on user creation</li>
						<li><strong>No exposure:</strong> Passwords never sent to client</li>
					</ul>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<Search class="h-5 w-5" />
						Search & Filter
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Search users by username, email, or ID. Toggle column visibility and sort by any field.
					</p>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle class="flex items-center gap-2">
						<FileDown class="h-5 w-5" />
						Export Users
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<p class="text-sm text-muted-foreground">
						Export user data (excluding passwords) in CSV, Excel, or PDF formats for reporting.
					</p>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<Separator />

	<!-- Technical Details -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
				<Code2 class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">Technical Implementation</h2>
				<p class="text-muted-foreground">Schema and Services</p>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<Card.Card class="bg-slate-950 text-slate-50">
				<Card.CardHeader>
					<Card.CardTitle class="text-slate-50 flex items-center gap-2">
						<Database class="h-5 w-5" />
						Database Schema
					</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<pre class="overflow-x-auto text-xs font-mono"><code
							>const user = pgTable('user', {'{'} 
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  age: integer('age'),
  passwordHash: text('password_hash').notNull()
{'}'});</code
						></pre>
				</Card.CardContent>
			</Card.Card>

			<Card.Card>
				<Card.CardHeader>
					<Card.CardTitle>File Structure</Card.CardTitle>
				</Card.CardHeader>
				<Card.CardContent>
					<div class="space-y-1 text-xs">
						<div class="flex items-center gap-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">lib/app/modules/user/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">models/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>user.schema.ts</span>
							<span class="text-muted-foreground ml-2"># Database table definition</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<Folder class="h-3.5 w-3.5 text-blue-400" />
							<span class="font-medium">forms/</span>
						</div>
						<div class="flex items-center gap-2 ml-8">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>user.form.ts</span>
							<span class="text-muted-foreground ml-2"># Create & edit form schemas</span>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<FolderOpen class="h-3.5 w-3.5 text-blue-500" />
							<span class="font-semibold">routes/panel/users/</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-slate-500" />
							<span>columns.ts</span>
							<span class="text-muted-foreground ml-2"># DataTable column definitions</span>
						</div>
						<div class="flex items-center gap-2 ml-4">
							<FileCode class="h-3.5 w-3.5 text-purple-500" />
							<span>+page.svelte</span>
							<span class="text-muted-foreground ml-2"># UI component with CRUD</span>
						</div>
					</div>
				</Card.CardContent>
			</Card.Card>
		</div>
	</section>

	<Separator />

	<!-- How to Use -->
	<section class="space-y-4">
		<h2 class="text-2xl font-bold tracking-tight">Usage Guide</h2>

		<div class="grid gap-4">
			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2 flex items-center gap-2">
					<UserPlus class="h-4 w-4" />
					Creating Users
				</h3>
				<p class="text-sm text-muted-foreground">
					Click "Create User" and provide username, email, name, age, and password. The password will be hashed using Argon2 before storage.
				</p>
			</div>

			<div class="border rounded-lg p-4">
				<h3 class="font-semibold mb-2 flex items-center gap-2">
					<Shield class="h-4 w-4" />
					Password Security
				</h3>
				<p class="text-sm text-muted-foreground">
					When editing users, the password field is not shown. To change a password, users must use the password reset flow (not implemented in this panel).
				</p>
			</div>
		</div>
	</section>
</div>
