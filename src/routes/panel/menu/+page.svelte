<script lang="ts">
	import DataGrid from '$lib/components/custom-list/data-grid.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Plus, Pencil, Trash2 } from '@lucide/svelte';
	import ItemDetailDialog from '$lib/components/custom-list/item-detail-dialog.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { getMenuSchema } from '$lib/app/modules/menu/forms/menu.form';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import { menuColumns } from './columns';

	let { data } = $props();

	// @ts-ignore
	const crudState = new CrudState<any>();
	const menuSchema = getMenuSchema();

	// Detail View State
	let selectedItem = $state<any>(null);
	let openDetailDialog = $state(false);

	function openDetail(item: any) {
		selectedItem = item;
		openDetailDialog = true;
	}
</script>

<div class="space-y-6">
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Food Menu</h1>
			<p class="text-muted-foreground">Manage your delicious food and beverage items.</p>
		</div>
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Add Menu
		</Button>
	</div>

	<!-- Dialogs -->
	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={menuSchema}
		action="?/create"
		title="Create Menu Item"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={menuSchema}
			action="?/update"
			title="Edit Menu Item"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.name}
			title="Delete Menu Item"
			description="Are you sure you want to delete this menu item?"
			action="?/delete"
		/>
	{/if}

	<DataGrid data={data.menus} columns={menuColumns} >
		{#snippet renderCard(menu)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="group relative h-full">
				<div 
					onclick={() => openDetail(menu)} 
					class="contents cursor-pointer"
				>
					<Card.Root class="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all active:scale-[0.98]">
						<!-- Image Gallery (Horizontal Scroll) -->
						<div class="relative w-full aspect-video bg-muted overflow-hidden">
							<img 
								src={Array.isArray(menu.images) ? menu.images[0] : menu.images} 
								alt={menu.name} 
								class="w-full h-full object-cover" 
								loading="lazy"
							/>
							{#if Array.isArray(menu.images) && menu.images.length > 1}
								<div class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
									+{menu.images.length - 1}
								</div>
							{/if}
						</div>

						<Card.Header>
							<div class="flex justify-between items-start">
								<Card.Title class="text-xl">{menu.name}</Card.Title>
								<Badge variant={menu.category === 'Food' ? 'default' : 'secondary'}>
									{menu.category}
								</Badge>
							</div>
							<Card.Description class="line-clamp-2 mt-1">
								{menu.description}
							</Card.Description>
						</Card.Header>
						<Card.Content class="mt-auto pb-12"> <!-- Extra padding for buttons -->
							<p class="font-bold text-lg">
								{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(menu.price)}
							</p>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Floating Action Buttons (Show on Hover) -->
				<div class="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 z-10">
					<Button 
						size="icon" 
						variant="secondary" 
						class="shadow-sm hover:bg-background"
						onclick={(e) => { e.stopPropagation(); crudState.openEdit(menu); }}
					>
						<Pencil class="w-4 h-4" />
					</Button>
					<Button 
						size="icon" 
						variant="destructive" 
						class="shadow-sm"
						onclick={(e) => { e.stopPropagation(); crudState.openDelete(menu); }}
					>
						<Trash2 class="w-4 h-4" />
					</Button>
				</div>
			</div>
		{/snippet}
	</DataGrid>
</div>

{#if selectedItem}
	<ItemDetailDialog 
		bind:open={openDetailDialog} 
		title={selectedItem.name}
		images={selectedItem.images}
	>
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<Badge class="text-lg py-1 px-3" variant={selectedItem.category === 'Food' ? 'default' : 'secondary'}>
					{selectedItem.category}
				</Badge>
				<p class="text-2xl font-bold text-primary">
					{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(selectedItem.price)}
				</p>
			</div>
			
			<p class="text-lg leading-relaxed text-muted-foreground">
				{selectedItem.description}
			</p>

			<div class="flex justify-end gap-2 pt-4 border-t">
				<Button variant="outline" onclick={() => { openDetailDialog = false; crudState.openEdit(selectedItem); }}>
					<Pencil class="w-4 h-4 mr-2" /> Edit Item
				</Button>
			</div>
		</div>
	</ItemDetailDialog>
{/if}
