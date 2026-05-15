<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Zap,
		LayoutDashboard,
		Shield,
		Database,
		ArrowLeft,
		Plus,
		Pencil,
		Trash2,
		Search,
		Download,
		Eye,
		Copy,
		Check,
		Code,
		Monitor,
		AlertCircle,
		Info,
		CheckCircle2,
		XCircle
	} from '@lucide/svelte';

	// Copy functionality
	let copiedId: string | null = $state(null);

	async function copyCode(code: string, id: string) {
		await navigator.clipboard.writeText(code);
		copiedId = id;
		setTimeout(() => (copiedId = null), 2000);
	}

	// Demo data
	const demoProducts = [
		{ id: 1, name: 'Chocolate Shake', category: 'Beverages', price: 25000, stock: 50 },
		{ id: 2, name: 'Vanilla Ice Cream', category: 'Desserts', price: 18000, stock: 30 },
		{ id: 3, name: 'Cheese Burger', category: 'Food', price: 35000, stock: 25 }
	];

	let searchValue = $state('');
	let selectedRows = $state<number[]>([]);

	function toggleRow(id: number) {
		if (selectedRows.includes(id)) {
			selectedRows = selectedRows.filter((r) => r !== id);
		} else {
			selectedRows = [...selectedRows, id];
		}
	}

	const filteredProducts = $derived(
		demoProducts.filter((p) => p.name.toLowerCase().includes(searchValue.toLowerCase()))
	);

	// Source code examples
	const codeExamples = {
		buttons: `<script>
  import { Button } from '$lib/components/ui/button';
  import { Plus } from '@lucide/svelte';
<\/script>

<!-- Variants -->
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

<!-- Sizes -->
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus class="h-4 w-4" /></Button>`,

		badges: `<script>
  import { Badge } from '$lib/components/ui/badge';
<\/script>

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`,

		form: `<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Button } from '$lib/components/ui/button';
  import * as Select from '$lib/components/ui/select';
  import { Textarea } from '$lib/components/ui/textarea';
<\/script>

<form class="space-y-4">
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="space-y-2">
      <Label for="name">Product Name</Label>
      <Input id="name" placeholder="Enter name" />
    </div>
    <div class="space-y-2">
      <Label for="category">Category</Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Select category" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="food">Food</Select.Item>
          <Select.Item value="drink">Drink</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  </div>
  <div class="space-y-2">
    <Label>Description</Label>
    <Textarea placeholder="Enter description..." />
  </div>
  <Button type="submit">Submit</Button>
</form>`,

		table: `<script>
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Search, Plus, Eye, Pencil, Trash2 } from '@lucide/svelte';

  let searchValue = $state('');
  const products = [
    { id: 1, name: 'Product A', category: 'Food', price: 25000 },
    { id: 2, name: 'Product B', category: 'Drink', price: 15000 }
  ];

  const filtered = $derived(
    products.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase()))
  );
<\/script>

<!-- Toolbar -->
<div class="flex gap-4 mb-4">
  <div class="relative flex-1">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
    <Input placeholder="Search..." class="pl-9" bind:value={searchValue} />
  </div>
  <Button><Plus class="h-4 w-4 mr-2" /> Add</Button>
</div>

<!-- Table -->
<table class="w-full border rounded-md">
  <thead class="bg-muted">
    <tr>
      <th class="p-3 text-left">Name</th>
      <th class="p-3 text-left">Category</th>
      <th class="p-3 text-left">Price</th>
      <th class="p-3 text-right">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each filtered as item}
      <tr class="border-t">
        <td class="p-3">{item.name}</td>
        <td class="p-3"><Badge variant="secondary">{item.category}</Badge></td>
        <td class="p-3">Rp {item.price.toLocaleString()}</td>
        <td class="p-3 text-right">
          <Button variant="ghost" size="icon"><Eye class="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Pencil class="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Trash2 class="h-4 w-4" /></Button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>`,

		alerts: `<!-- Info Alert -->
<div class="flex items-start gap-3 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/30">
  <Info class="h-5 w-5 text-blue-600" />
  <div>
    <h4 class="font-medium">Information</h4>
    <p class="text-sm">This is an info message.</p>
  </div>
</div>

<!-- Success Alert -->
<div class="flex items-start gap-3 p-4 rounded-lg border bg-green-50 dark:bg-green-950/30">
  <CheckCircle2 class="h-5 w-5 text-green-600" />
  <div>
    <h4 class="font-medium">Success</h4>
    <p class="text-sm">Operation completed successfully.</p>
  </div>
</div>

<!-- Warning Alert -->
<div class="flex items-start gap-3 p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950/30">
  <AlertCircle class="h-5 w-5 text-yellow-600" />
  <div>
    <h4 class="font-medium">Warning</h4>
    <p class="text-sm">Please review before continuing.</p>
  </div>
</div>

<!-- Error Alert -->
<div class="flex items-start gap-3 p-4 rounded-lg border bg-red-50 dark:bg-red-950/30">
  <XCircle class="h-5 w-5 text-red-600" />
  <div>
    <h4 class="font-medium">Error</h4>
    <p class="text-sm">An error occurred.</p>
  </div>
</div>`,

		cards: `<script>
  import * as Card from '$lib/components/ui/card';
  import { LayoutDashboard } from '@lucide/svelte';
<\/script>

<Card.Card class="hover:shadow-lg transition-all">
  <Card.CardHeader>
    <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <LayoutDashboard class="h-6 w-6" />
    </div>
    <Card.CardTitle>Feature Title</Card.CardTitle>
  </Card.CardHeader>
  <Card.CardContent>
    <p class="text-muted-foreground">Feature description goes here.</p>
  </Card.CardContent>
</Card.Card>`
	};
</script>

<svelte:head>
	<title>Demo - Velaris</title>
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
		<div class="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
			<div class="flex items-center gap-4">
				<Button variant="ghost" size="sm" href="/" class="gap-2">
					<ArrowLeft class="h-4 w-4" />
					Back
				</Button>
				<Separator orientation="vertical" class="h-6" />
				<div class="flex items-center gap-2 font-bold text-lg">
					<div
						class="h-7 w-7 rounded bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground"
					>
						<Zap class="h-4 w-4 fill-current" />
					</div>
					Component Demo
				</div>
			</div>
			<div class="flex items-center gap-2">
				<Badge variant="secondary">Preview + Code</Badge>
				<Button size="sm" href="/panel/dashboard">Open Dashboard</Button>
			</div>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8 max-w-7xl space-y-12">
		<!-- Hero -->
		<section class="text-center py-8">
			<h1 class="text-4xl font-bold tracking-tight mb-4">Component Examples</h1>
			<p class="text-muted-foreground max-w-2xl mx-auto">
				Interactive previews with copy-paste ready source code. Click on "Code" tab to see the
				implementation.
			</p>
		</section>

		<!-- Buttons -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold flex items-center gap-2">
				<Badge variant="outline">UI</Badge>
				Buttons
			</h2>

			<Card.Card>
				<Tabs.Root value="preview">
					<Card.CardHeader class="pb-0">
						<Tabs.List class="w-fit">
							<Tabs.Trigger value="preview" class="gap-2">
								<Monitor class="h-4 w-4" />
								Preview
							</Tabs.Trigger>
							<Tabs.Trigger value="code" class="gap-2">
								<Code class="h-4 w-4" />
								Code
							</Tabs.Trigger>
						</Tabs.List>
					</Card.CardHeader>
					<Card.CardContent class="pt-6">
						<Tabs.Content value="preview">
							<div class="space-y-6">
								<div>
									<p class="text-sm text-muted-foreground mb-3">Variants</p>
									<div class="flex flex-wrap gap-3">
										<Button>Default</Button>
										<Button variant="secondary">Secondary</Button>
										<Button variant="outline">Outline</Button>
										<Button variant="ghost">Ghost</Button>
										<Button variant="destructive">Destructive</Button>
									</div>
								</div>
								<Separator />
								<div>
									<p class="text-sm text-muted-foreground mb-3">Sizes</p>
									<div class="flex flex-wrap items-center gap-3">
										<Button size="sm">Small</Button>
										<Button>Default</Button>
										<Button size="lg">Large</Button>
										<Button size="icon"><Plus class="h-4 w-4" /></Button>
									</div>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="code">
							<div class="relative">
								<button
									class="absolute top-3 right-3 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors"
									onclick={() => copyCode(codeExamples.buttons, 'buttons')}
								>
									{#if copiedId === 'buttons'}
										<Check class="h-4 w-4 text-green-500" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</button>
								<pre
									class="text-xs font-mono bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto"><code
										>{codeExamples.buttons}</code
									></pre>
							</div>
						</Tabs.Content>
					</Card.CardContent>
				</Tabs.Root>
			</Card.Card>
		</section>

		<!-- Badges -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold flex items-center gap-2">
				<Badge variant="outline">UI</Badge>
				Badges
			</h2>

			<Card.Card>
				<Tabs.Root value="preview">
					<Card.CardHeader class="pb-0">
						<Tabs.List class="w-fit">
							<Tabs.Trigger value="preview" class="gap-2">
								<Monitor class="h-4 w-4" />
								Preview
							</Tabs.Trigger>
							<Tabs.Trigger value="code" class="gap-2">
								<Code class="h-4 w-4" />
								Code
							</Tabs.Trigger>
						</Tabs.List>
					</Card.CardHeader>
					<Card.CardContent class="pt-6">
						<Tabs.Content value="preview">
							<div class="flex flex-wrap gap-3">
								<Badge>Default</Badge>
								<Badge variant="secondary">Secondary</Badge>
								<Badge variant="outline">Outline</Badge>
								<Badge variant="destructive">Destructive</Badge>
							</div>
						</Tabs.Content>
						<Tabs.Content value="code">
							<div class="relative">
								<button
									class="absolute top-3 right-3 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors"
									onclick={() => copyCode(codeExamples.badges, 'badges')}
								>
									{#if copiedId === 'badges'}
										<Check class="h-4 w-4 text-green-500" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</button>
								<pre
									class="text-xs font-mono bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto"><code
										>{codeExamples.badges}</code
									></pre>
							</div>
						</Tabs.Content>
					</Card.CardContent>
				</Tabs.Root>
			</Card.Card>
		</section>

		<!-- Form -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold flex items-center gap-2">
				<Badge variant="outline">Forms</Badge>
				Form Builder
			</h2>

			<Card.Card>
				<Tabs.Root value="preview">
					<Card.CardHeader class="pb-0">
						<Tabs.List class="w-fit">
							<Tabs.Trigger value="preview" class="gap-2">
								<Monitor class="h-4 w-4" />
								Preview
							</Tabs.Trigger>
							<Tabs.Trigger value="code" class="gap-2">
								<Code class="h-4 w-4" />
								Code
							</Tabs.Trigger>
						</Tabs.List>
					</Card.CardHeader>
					<Card.CardContent class="pt-6">
						<Tabs.Content value="preview">
							<form class="space-y-4 max-w-2xl">
								<div class="grid gap-4 sm:grid-cols-2">
									<div class="space-y-2">
										<Label for="name">Product Name</Label>
										<Input id="name" placeholder="e.g. Chocolate Shake" />
									</div>
									<div class="space-y-2">
										<Label for="category">Category</Label>
										<Select.Root>
											<Select.Trigger class="w-full">
												<Select.Value placeholder="Select category" />
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="food">Food</Select.Item>
												<Select.Item value="beverages">Beverages</Select.Item>
												<Select.Item value="desserts">Desserts</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
									<div class="space-y-2">
										<Label for="price">Price</Label>
										<Input id="price" type="number" placeholder="0" />
									</div>
									<div class="space-y-2">
										<Label for="stock">Stock</Label>
										<Input id="stock" type="number" placeholder="0" />
									</div>
								</div>
								<div class="space-y-2">
									<Label for="description">Description</Label>
									<Textarea id="description" placeholder="Product description..." />
								</div>
								<div class="flex gap-3">
									<Button type="button">Create Product</Button>
									<Button type="button" variant="outline">Cancel</Button>
								</div>
							</form>
						</Tabs.Content>
						<Tabs.Content value="code">
							<div class="relative">
								<button
									class="absolute top-3 right-3 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors"
									onclick={() => copyCode(codeExamples.form, 'form')}
								>
									{#if copiedId === 'form'}
										<Check class="h-4 w-4 text-green-500" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</button>
								<pre
									class="text-xs font-mono bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto"><code
										>{codeExamples.form}</code
									></pre>
							</div>
						</Tabs.Content>
					</Card.CardContent>
				</Tabs.Root>
			</Card.Card>
		</section>

		<!-- Data Table -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold flex items-center gap-2">
				<Badge variant="outline">Data</Badge>
				Data Table
			</h2>

			<Card.Card>
				<Tabs.Root value="preview">
					<Card.CardHeader class="pb-0">
						<Tabs.List class="w-fit">
							<Tabs.Trigger value="preview" class="gap-2">
								<Monitor class="h-4 w-4" />
								Preview
							</Tabs.Trigger>
							<Tabs.Trigger value="code" class="gap-2">
								<Code class="h-4 w-4" />
								Code
							</Tabs.Trigger>
						</Tabs.List>
					</Card.CardHeader>
					<Card.CardContent class="pt-6">
						<Tabs.Content value="preview">
							<!-- Toolbar -->
							<div class="flex flex-col sm:flex-row gap-4 mb-4">
								<div class="relative flex-1">
									<Search
										class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
									/>
									<Input placeholder="Search products..." class="pl-9" bind:value={searchValue} />
								</div>
								<div class="flex gap-2">
									<Button variant="outline" size="sm" class="gap-2">
										<Download class="h-4 w-4" />
										Export
									</Button>
									<Button size="sm" class="gap-2">
										<Plus class="h-4 w-4" />
										Add
									</Button>
								</div>
							</div>

							<!-- Table -->
							<div class="rounded-md border overflow-hidden">
								<table class="w-full">
									<thead class="bg-muted/50">
										<tr>
											<th class="p-3 text-left">
												<input type="checkbox" class="rounded" />
											</th>
											<th class="p-3 text-left text-sm font-medium">Name</th>
											<th class="p-3 text-left text-sm font-medium">Category</th>
											<th class="p-3 text-left text-sm font-medium">Price</th>
											<th class="p-3 text-left text-sm font-medium">Stock</th>
											<th class="p-3 text-right text-sm font-medium">Actions</th>
										</tr>
									</thead>
									<tbody>
										{#each filteredProducts as product}
											<tr class="border-t hover:bg-muted/30">
												<td class="p-3">
													<input
														type="checkbox"
														class="rounded"
														checked={selectedRows.includes(product.id)}
														onchange={() => toggleRow(product.id)}
													/>
												</td>
												<td class="p-3 font-medium">{product.name}</td>
												<td class="p-3"><Badge variant="secondary">{product.category}</Badge></td>
												<td class="p-3">Rp {product.price.toLocaleString()}</td>
												<td class="p-3">{product.stock}</td>
												<td class="p-3 text-right">
													<div class="flex justify-end gap-1">
														<Button variant="ghost" size="icon" class="h-8 w-8"
															><Eye class="h-4 w-4" /></Button
														>
														<Button variant="ghost" size="icon" class="h-8 w-8"
															><Pencil class="h-4 w-4" /></Button
														>
														<Button variant="ghost" size="icon" class="h-8 w-8 text-destructive"
															><Trash2 class="h-4 w-4" /></Button
														>
													</div>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>

							<div class="flex items-center justify-between mt-4 text-sm text-muted-foreground">
								<span>{selectedRows.length} of {demoProducts.length} selected</span>
								<div class="flex gap-2">
									<Button variant="outline" size="sm" disabled>Previous</Button>
									<Button variant="outline" size="sm" disabled>Next</Button>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="code">
							<div class="relative">
								<button
									class="absolute top-3 right-3 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors"
									onclick={() => copyCode(codeExamples.table, 'table')}
								>
									{#if copiedId === 'table'}
										<Check class="h-4 w-4 text-green-500" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</button>
								<pre
									class="text-xs font-mono bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto"><code
										>{codeExamples.table}</code
									></pre>
							</div>
						</Tabs.Content>
					</Card.CardContent>
				</Tabs.Root>
			</Card.Card>
		</section>

		<!-- Alerts -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold flex items-center gap-2">
				<Badge variant="outline">Feedback</Badge>
				Alerts
			</h2>

			<Card.Card>
				<Tabs.Root value="preview">
					<Card.CardHeader class="pb-0">
						<Tabs.List class="w-fit">
							<Tabs.Trigger value="preview" class="gap-2">
								<Monitor class="h-4 w-4" />
								Preview
							</Tabs.Trigger>
							<Tabs.Trigger value="code" class="gap-2">
								<Code class="h-4 w-4" />
								Code
							</Tabs.Trigger>
						</Tabs.List>
					</Card.CardHeader>
					<Card.CardContent class="pt-6">
						<Tabs.Content value="preview">
							<div class="grid gap-4">
								<div
									class="flex items-start gap-3 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
								>
									<Info class="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
									<div>
										<h4 class="font-medium text-blue-900 dark:text-blue-100">Information</h4>
										<p class="text-sm text-blue-700 dark:text-blue-300">
											This is an informational message.
										</p>
									</div>
								</div>

								<div
									class="flex items-start gap-3 p-4 rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
								>
									<CheckCircle2
										class="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5"
									/>
									<div>
										<h4 class="font-medium text-green-900 dark:text-green-100">Success</h4>
										<p class="text-sm text-green-700 dark:text-green-300">
											Your changes have been saved.
										</p>
									</div>
								</div>

								<div
									class="flex items-start gap-3 p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900"
								>
									<AlertCircle
										class="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5"
									/>
									<div>
										<h4 class="font-medium text-yellow-900 dark:text-yellow-100">Warning</h4>
										<p class="text-sm text-yellow-700 dark:text-yellow-300">
											Please review before proceeding.
										</p>
									</div>
								</div>

								<div
									class="flex items-start gap-3 p-4 rounded-lg border bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
								>
									<XCircle class="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
									<div>
										<h4 class="font-medium text-red-900 dark:text-red-100">Error</h4>
										<p class="text-sm text-red-700 dark:text-red-300">An error occurred.</p>
									</div>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="code">
							<div class="relative">
								<button
									class="absolute top-3 right-3 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors"
									onclick={() => copyCode(codeExamples.alerts, 'alerts')}
								>
									{#if copiedId === 'alerts'}
										<Check class="h-4 w-4 text-green-500" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</button>
								<pre
									class="text-xs font-mono bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto"><code
										>{codeExamples.alerts}</code
									></pre>
							</div>
						</Tabs.Content>
					</Card.CardContent>
				</Tabs.Root>
			</Card.Card>
		</section>

		<!-- Cards -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold flex items-center gap-2">
				<Badge variant="outline">Layout</Badge>
				Feature Cards
			</h2>

			<Card.Card>
				<Tabs.Root value="preview">
					<Card.CardHeader class="pb-0">
						<Tabs.List class="w-fit">
							<Tabs.Trigger value="preview" class="gap-2">
								<Monitor class="h-4 w-4" />
								Preview
							</Tabs.Trigger>
							<Tabs.Trigger value="code" class="gap-2">
								<Code class="h-4 w-4" />
								Code
							</Tabs.Trigger>
						</Tabs.List>
					</Card.CardHeader>
					<Card.CardContent class="pt-6">
						<Tabs.Content value="preview">
							<div class="grid gap-6 sm:grid-cols-3">
								<Card.Card class="group hover:shadow-lg hover:border-primary/50 transition-all">
									<Card.CardHeader>
										<div
											class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
										>
											<LayoutDashboard class="h-6 w-6" />
										</div>
										<Card.CardTitle>Dashboard</Card.CardTitle>
									</Card.CardHeader>
									<Card.CardContent>
										<p class="text-muted-foreground text-sm">
											Pre-built responsive dashboard layout.
										</p>
									</Card.CardContent>
								</Card.Card>

								<Card.Card class="group hover:shadow-lg hover:border-primary/50 transition-all">
									<Card.CardHeader>
										<div
											class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
										>
											<Shield class="h-6 w-6" />
										</div>
										<Card.CardTitle>Authentication</Card.CardTitle>
									</Card.CardHeader>
									<Card.CardContent>
										<p class="text-muted-foreground text-sm">
											Secure auth with session management.
										</p>
									</Card.CardContent>
								</Card.Card>

								<Card.Card class="group hover:shadow-lg hover:border-primary/50 transition-all">
									<Card.CardHeader>
										<div
											class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
										>
											<Database class="h-6 w-6" />
										</div>
										<Card.CardTitle>Database</Card.CardTitle>
									</Card.CardHeader>
									<Card.CardContent>
										<p class="text-muted-foreground text-sm">Drizzle ORM with PostgreSQL.</p>
									</Card.CardContent>
								</Card.Card>
							</div>
						</Tabs.Content>
						<Tabs.Content value="code">
							<div class="relative">
								<button
									class="absolute top-3 right-3 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors"
									onclick={() => copyCode(codeExamples.cards, 'cards')}
								>
									{#if copiedId === 'cards'}
										<Check class="h-4 w-4 text-green-500" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</button>
								<pre
									class="text-xs font-mono bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto"><code
										>{codeExamples.cards}</code
									></pre>
							</div>
						</Tabs.Content>
					</Card.CardContent>
				</Tabs.Root>
			</Card.Card>
		</section>

		<!-- CTA -->
		<section class="py-8">
			<Card.Card class="bg-gradient-to-br from-primary/10 via-transparent to-blue-600/10 border-2">
				<Card.CardContent class="py-12 text-center">
					<h2 class="text-2xl font-bold mb-4">Ready to explore more?</h2>
					<p class="text-muted-foreground mb-6 max-w-xl mx-auto">
						Try the full dashboard experience with all features enabled.
					</p>
					<div class="flex flex-col sm:flex-row gap-3 justify-center">
						<Button size="lg" href="/panel/dashboard" class="gap-2">
							<LayoutDashboard class="h-4 w-4" />
							Open Dashboard
						</Button>
						<Button size="lg" variant="outline" href="/docs">View Documentation</Button>
					</div>
				</Card.CardContent>
			</Card.Card>
		</section>
	</main>
</div>
