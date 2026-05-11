<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
	import {
		Database,
		Wrench,
		Shield,
		LayoutTemplate,
		Box,
		Globe,
		FileCode,
		Copy,
		Check
	} from '@lucide/svelte';

	let copiedId: string | null = $state(null);

	async function copyCode(code: string, id: string) {
		await navigator.clipboard.writeText(code);
		copiedId = id;
		setTimeout(() => (copiedId = null), 2000);
	}

	// Code examples
	const examples = {
		database: {
			schema: `// src/lib/app/modules/product/models/product.schema.ts
import { pgTable, text, integer, timestamp, json } from 'drizzle-orm/pg-core';

export const product = pgTable('product', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    categoryId: text('category_id').notNull(),
    price: integer('price').notNull(),
    stock: integer('stock').notNull().default(0),
    images: json('images').$type<string[]>(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export type Product = typeof product.$inferSelect;`,
			query: `// Example queries using Drizzle ORM
import { db } from '$lib/app/database';
import { product } from './product.schema';
import { eq, desc } from 'drizzle-orm';

// Get all products
const products = await db.select().from(product).orderBy(desc(product.updatedAt));

// Get single product
const [item] = await db.select().from(product).where(eq(product.id, id)).limit(1);

// Insert product
await db.insert(product).values({ id: crypto.randomUUID(), name: 'New Product', ... });

// Update product
await db.update(product).set({ name: 'Updated' }).where(eq(product.id, id));

// Delete product
await db.delete(product).where(eq(product.id, id));`
		},
		helpers: {
			export: `// Using ExportHelper
import { ExportHelper, type ExportFormat } from '$lib/app/helpers/export.helper';

// Single format export
ExportHelper.exportCSV(data, columns, 'products.csv');
ExportHelper.exportXLSX(data, columns, 'products.xlsx');
ExportHelper.exportPDF(data, columns, 'products.pdf');

// Multi-format with switch case
function handleExport(format: ExportFormat) {
    const filename = \`products_\${new Date().toISOString().split('T')[0]}\`;
    ExportHelper.export(format, data, productColumns, filename);
}

// In template - specify available formats
<DataTableToolbar 
    onExport={handleExport} 
    exportFormats={['csv', 'xlsx']}  // Only CSV and Excel
/>`,
			tableState: `// Using TableState
import { TableState } from '$lib/app/helpers/table.state.svelte';
import { productColumns } from './columns';

const tableState = new TableState(productColumns);

// In template
<DataTableToolbar
    bind:searchValue={tableState.searchValue}
    onSearch={tableState.applySearch}
    onClear={tableState.clearSearch}
    bind:columns={tableState.visibleColumns}
    onToggleColumn={tableState.toggleColumn}
/>

<DataTable
    data={data}
    columns={productColumns}
    visibleColumns={tableState.visibleColumns}
    searchTerm={tableState.activeSearchTerm}
    bind:sortColumn={tableState.sortColumn}
    bind:sortOrder={tableState.sortOrder}
    bind:selectedRows={tableState.selectedRows}
/>`,
			crudState: `// Using CrudState
import { CrudState } from '$lib/app/helpers/crud.state.svelte';

const crudState = new CrudState<Product>();

// Open dialogs
<Button onclick={crudState.openCreate}>Add Product</Button>
<Button onclick={() => crudState.openEdit(item)}>Edit</Button>
<Button onclick={() => crudState.openDelete(item)}>Delete</Button>

// Bind to dialogs
<DataTableFormDialog
    bind:open={crudState.showCreate}
    mode="create"
    schema={productSchema}
    action="?/create"
/>

{#if crudState.showEdit}
    <DataTableFormDialog
        bind:open={crudState.showEdit}
        mode="edit"
        data={crudState.editItem}
        schema={productSchema}
        action="?/update"
    />
{/if}`
		},
		middleware: {
			isLogin: `// src/routes/panel/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { isLogin } from '$lib/app/middleware';

export const load: LayoutServerLoad = async (event) => {
    return isLogin(event);
};`,
			isLoginWithRole: `// Protect route with specific roles
import { isLoginWithRole } from '$lib/app/middleware';

export const load: LayoutServerLoad = async (event) => {
    // Only allow admin and manager
    return isLoginWithRole(event, ['admin', 'manager']);
};`,
			isGuest: `// src/routes/login/+page.server.ts
import { isGuest } from '$lib/app/middleware';

export const load: PageServerLoad = async (event) => {
    // Redirect to dashboard if already logged in
    return isGuest(event);
};`
		},
		modules: {
			service: `// src/lib/app/modules/product/services/product.service.ts
import { db } from '$lib/app/database';
import { product } from '../models/product.schema';
import { eq, desc } from 'drizzle-orm';
import type { CreateProductDTO, UpdateProductDTO } from '../requests/product.request';

export class ProductService {
    static async getAll() {
        return db.select().from(product).orderBy(desc(product.updatedAt));
    }

    static async create(data: CreateProductDTO) {
        const id = crypto.randomUUID();
        // Handle file uploads if needed
        await db.insert(product).values({
            id,
            name: data.name,
            categoryId: data.categoryId,
            price: data.price,
            stock: data.stock
        });
    }

    static async update(data: UpdateProductDTO) {
        await db.update(product)
            .set({ name: data.name, price: data.price, ... })
            .where(eq(product.id, data.id));
    }

    static async delete(id: string) {
        await db.delete(product).where(eq(product.id, id));
    }
}`,
			request: `// src/lib/app/modules/product/requests/product.request.ts
import { z } from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.string().min(1, "Category is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().min(0, "Stock must be positive"),
    images: z.array(z.instanceof(File)).optional(),
    image_path: z.string().optional().default('uploads/products')
});

export const UpdateProductSchema = CreateProductSchema.extend({
    id: z.string().min(1, "ID is required"),
    images_existing: z.array(z.string()).optional(),
    images_deleted: z.array(z.string()).optional()
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;`,
			form: `// src/lib/app/modules/product/forms/product.form.ts
import type { FormSchema } from '$lib/types/form-builder';

export function getProductSchema(categories: { value: string; label: string }[]): FormSchema {
    return [
        {
            type: 'grid',
            columns: 2,
            children: [
                { name: 'name', type: 'text', label: 'Product Name', required: true },
                { 
                    name: 'categoryId', 
                    type: 'select', 
                    label: 'Category', 
                    options: categories,
                    required: true 
                },
                { name: 'price', type: 'number', label: 'Price', required: true },
                { name: 'stock', type: 'number', label: 'Stock', required: true }
            ]
        },
        {
            name: 'images',
            type: 'file',
            label: 'Product Images',
            accept: 'image/*',
            multiple: true,
            maxSize: 5 * 1024 * 1024,
            path: 'uploads/products'
        }
    ];
}`
		},
		routes: {
			pageServer: `// src/routes/panel/products/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ProductService } from '$lib/app/modules/product/services/product.service';
import { CreateProductSchema, UpdateProductSchema } from '$lib/app/modules/product/requests/product.request';

export const load: PageServerLoad = async () => {
    const products = await ProductService.getAll();
    return { products };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const rawData = {
            name: formData.get('name'),
            categoryId: formData.get('categoryId'),
            price: formData.get('price'),
            stock: formData.get('stock')
        };

        const result = CreateProductSchema.safeParse(rawData);
        if (!result.success) {
            return fail(400, { message: 'Validation failed', errors: result.error.flatten().fieldErrors });
        }

        await ProductService.create(result.data);
        return { success: true };
    },

    update: async ({ request }) => {
        // Similar pattern...
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        await ProductService.delete(id);
        return { success: true };
    }
};`,
			columns: `// src/routes/panel/products/columns.ts
import type { DataTableColumn } from '$lib/types/data-table';

export interface Product {
    id: string;
    name: string;
    categoryId: string;
    category_name?: string;
    price: number;
    stock: number;
    images?: string[] | null;
    updatedAt?: Date;
}

export const productColumns: DataTableColumn<Product>[] = [
    { accessorKey: 'id', label: 'ID', type: 'text' },
    { accessorKey: 'name', label: 'Name', type: 'text', sortable: true },
    { accessorKey: 'category_name', label: 'Category', type: 'text' },
    { 
        accessorKey: 'price', 
        label: 'Price', 
        type: 'number', 
        sortable: true,
        format: (value) => \`Rp \${value.toLocaleString()}\`
    },
    { accessorKey: 'stock', label: 'Stock', type: 'number', sortable: true },
    { accessorKey: 'images', label: 'Images', type: 'image' },
    { accessorKey: 'updatedAt', label: 'Updated', type: 'date', sortable: true }
];`
		}
	};
</script>

<div class="space-y-8">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Code Examples</h1>
		<p class="leading-7 [&:not(:first-child)]:mt-6 text-xl text-muted-foreground">
			Ready-to-use code snippets for each folder in the project.
		</p>
	</div>

	<!-- Database Examples -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"
			>
				<Database class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">database/</h2>
				<p class="text-muted-foreground">Drizzle ORM schema & queries</p>
			</div>
		</div>

		<Tabs.Root value="schema">
			<Tabs.List>
				<Tabs.Trigger value="schema">Schema Definition</Tabs.Trigger>
				<Tabs.Trigger value="query">Query Examples</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="schema">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.database.schema, 'db-schema')}
					>
						{#if copiedId === 'db-schema'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.database.schema}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
			<Tabs.Content value="query">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.database.query, 'db-query')}
					>
						{#if copiedId === 'db-query'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.database.query}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<Separator />

	<!-- Helpers Examples -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div
				class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400"
			>
				<Wrench class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">helpers/</h2>
				<p class="text-muted-foreground">Utility classes for export, table state & CRUD</p>
			</div>
		</div>

		<Tabs.Root value="export">
			<Tabs.List>
				<Tabs.Trigger value="export">ExportHelper</Tabs.Trigger>
				<Tabs.Trigger value="table">TableState</Tabs.Trigger>
				<Tabs.Trigger value="crud">CrudState</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="export">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.helpers.export, 'helpers-export')}
					>
						{#if copiedId === 'helpers-export'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.helpers.export}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
			<Tabs.Content value="table">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.helpers.tableState, 'helpers-table')}
					>
						{#if copiedId === 'helpers-table'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.helpers.tableState}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
			<Tabs.Content value="crud">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.helpers.crudState, 'helpers-crud')}
					>
						{#if copiedId === 'helpers-crud'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.helpers.crudState}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<Separator />

	<!-- Middleware Examples -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
				<Shield class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">middleware/</h2>
				<p class="text-muted-foreground">Authentication guards for route protection</p>
			</div>
		</div>

		<Tabs.Root value="isLogin">
			<Tabs.List>
				<Tabs.Trigger value="isLogin">isLogin</Tabs.Trigger>
				<Tabs.Trigger value="isLoginWithRole">isLoginWithRole</Tabs.Trigger>
				<Tabs.Trigger value="isGuest">isGuest</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="isLogin">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.middleware.isLogin, 'mw-login')}
					>
						{#if copiedId === 'mw-login'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.middleware.isLogin}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
			<Tabs.Content value="isLoginWithRole">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.middleware.isLoginWithRole, 'mw-role')}
					>
						{#if copiedId === 'mw-role'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.middleware.isLoginWithRole}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
			<Tabs.Content value="isGuest">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.middleware.isGuest, 'mw-guest')}
					>
						{#if copiedId === 'mw-guest'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.middleware.isGuest}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<Separator />

	<!-- Modules Examples -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
				<LayoutTemplate class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">modules/</h2>
				<p class="text-muted-foreground">Feature-based module structure</p>
			</div>
		</div>

		<Tabs.Root value="service">
			<Tabs.List>
				<Tabs.Trigger value="service">Service</Tabs.Trigger>
				<Tabs.Trigger value="request">Request Schema</Tabs.Trigger>
				<Tabs.Trigger value="form">Form Schema</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="service">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.modules.service, 'mod-service')}
					>
						{#if copiedId === 'mod-service'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.modules.service}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
			<Tabs.Content value="request">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.modules.request, 'mod-request')}
					>
						{#if copiedId === 'mod-request'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.modules.request}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
			<Tabs.Content value="form">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.modules.form, 'mod-form')}
					>
						{#if copiedId === 'mod-form'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.modules.form}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<Separator />

	<!-- Routes Examples -->
	<section class="space-y-4">
		<div class="flex items-center gap-3">
			<div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
				<Globe class="h-8 w-8" />
			</div>
			<div>
				<h2 class="text-3xl font-bold tracking-tight">routes/</h2>
				<p class="text-muted-foreground">SvelteKit page routes & server actions</p>
			</div>
		</div>

		<Tabs.Root value="pageServer">
			<Tabs.List>
				<Tabs.Trigger value="pageServer">+page.server.ts</Tabs.Trigger>
				<Tabs.Trigger value="columns">columns.ts</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="pageServer">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.routes.pageServer, 'routes-server')}
					>
						{#if copiedId === 'routes-server'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.routes.pageServer}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
			<Tabs.Content value="columns">
				<Card.Card class="relative">
					<button
						class="absolute top-4 right-4 p-2 rounded-md hover:bg-muted transition-colors"
						onclick={() => copyCode(examples.routes.columns, 'routes-columns')}
					>
						{#if copiedId === 'routes-columns'}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<Card.CardContent class="pt-6">
						<pre
							class="text-xs font-mono overflow-x-auto bg-slate-950 text-slate-50 p-4 rounded-lg"><code
								>{examples.routes.columns}</code
							></pre>
					</Card.CardContent>
				</Card.Card>
			</Tabs.Content>
		</Tabs.Root>
	</section>
</div>
