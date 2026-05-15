<script lang="ts">
	import DataGrid from '$lib/components/custom-list/data-grid.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Calendar, Plus, Pencil, Trash2 } from '@lucide/svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import { getMomentsSchema } from '$lib/app/modules/moments/forms/moments.form';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import ItemDetailDialog from '$lib/components/custom-list/item-detail-dialog.svelte';
	import { momentsColumns } from './columns';

	let { data } = $props();

	// @ts-ignore
	const crudState = new CrudState<any>();
	const momentsSchema = getMomentsSchema();

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
			<h1 class="text-3xl font-bold tracking-tight">Moments</h1>
			<p class="text-muted-foreground">Capture and organize your special memories.</p>
		</div>
		<Button onclick={crudState.openCreate}>
			<Plus class="mr-2 h-4 w-4" /> Add Moment
		</Button>
	</div>

	<!-- Dialogs -->
	<DataTableFormDialog
		bind:open={crudState.showCreate}
		mode="create"
		schema={momentsSchema}
		action="?/create"
		title="Create Moment"
	/>

	{#if crudState.showEdit}
		<DataTableFormDialog
			bind:open={crudState.showEdit}
			mode="edit"
			data={crudState.editItem}
			schema={momentsSchema}
			action="?/update"
			title="Edit Moment"
		/>
	{/if}

	{#if crudState.showDelete && crudState.deleteItem}
		<DeleteDialog
			bind:open={crudState.showDelete}
			id={crudState.deleteItem.id}
			resourceName={crudState.deleteItem.title}
			title="Delete Moment"
			description="Are you sure you want to delete this moment?"
			action="?/delete"
		/>
	{/if}

	<DataGrid data={data.moments} columns={momentsColumns} >
		{#snippet renderCard(moment)}
			<div class="group relative h-full">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
			    <!-- svelte-ignore a11y_no_static_element_interactions -->
				<div onclick={() => openDetail(moment)} class="contents cursor-pointer">
					<Card.Root class="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all active:scale-[0.98]">
						<div class="relative w-full aspect-[4/3] overflow-hidden bg-muted">
							<img 
								src={moment.image} 
								alt={moment.title} 
								class="w-full h-full object-cover transition-transform group-hover:scale-105" 
								loading="lazy"
							/>
						</div>

						<Card.Header>
							<Card.Title class="text-lg">{moment.title}</Card.Title>
							<div class="flex items-center text-xs text-muted-foreground mt-1">
								<Calendar class="w-3 h-3 mr-1" />
								{new Date(moment.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
							</div>
						</Card.Header>
						<Card.Content class="pb-12">
							<p class="text-sm text-muted-foreground line-clamp-3">
								{moment.description}
							</p>
						</Card.Content>
					</Card.Root>
				</div>

				<!-- Floating Action Buttons -->
				<div class="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 z-10">
					<Button 
						size="icon" 
						variant="secondary" 
						class="shadow-sm hover:bg-background"
						onclick={(e) => { e.stopPropagation(); crudState.openEdit(moment); }}
					>
						<Pencil class="w-4 h-4" />
					</Button>
					<Button 
						size="icon" 
						variant="destructive" 
						class="shadow-sm"
						onclick={(e) => { e.stopPropagation(); crudState.openDelete(moment); }}
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
		title={selectedItem.title}
		images={selectedItem.image}
	>
		<div class="space-y-4">
			<div class="flex items-center text-muted-foreground">
				<Calendar class="w-4 h-4 mr-2" />
				{new Date(selectedItem.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}
			</div>
			
			<p class="text-lg leading-relaxed text-foreground">
				{selectedItem.description}
			</p>

			<div class="flex justify-end gap-2 pt-4 border-t">
				<Button variant="outline" onclick={() => { openDetailDialog = false; crudState.openEdit(selectedItem); }}>
					<Pencil class="w-4 h-4 mr-2" /> Edit Moment
				</Button>
			</div>
		</div>
	</ItemDetailDialog>
{/if}
