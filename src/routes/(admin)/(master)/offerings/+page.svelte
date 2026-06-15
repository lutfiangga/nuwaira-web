<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Tag, Plus, SquarePen, Trash2, CheckCircle2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import FormCombobox from '$lib/components/forms/form-combobox.svelte';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import DeleteDialog from '$lib/components/custom-table/data-table-delete-dialog.svelte';
	import {
		getCreateOfferingFormSchema,
		getEditOfferingFormSchema
	} from '$lib/app/modules/program/forms/offering.form';

	type Offering = {
		id: string;
		slug: string;
		type: string;
		name: string;
		title: string;
		priceAmount: number;
		badge: string | null;
		benefits: { content: string; position: number }[];
		batches: {
			id: string;
			title: string;
			isOpen: boolean;
			startDate: string | null;
			endDate: string | null;
		}[];
	};

	let {
		data,
		form
	}: {
		data: {
			programOptions: { value: string; label: string }[];
			selectedProgram: { id: string; title: string } | null;
			offerings: Offering[];
		};
		form?: Record<string, unknown> | null;
	} = $props();

	let programId = $state($page.url.searchParams.get('programId') ?? '');
	const offeringCrud = new CrudState();
	const createSchema = $derived(getCreateOfferingFormSchema());
	const editSchema = $derived(getEditOfferingFormSchema());
	let message = $state('');
	let errorMsg = $state('');
	let restoredForm: Record<string, unknown> | null | undefined;

	$effect(() => {
		if (form === restoredForm) return;
		restoredForm = form;
		if (form?.success) {
			message = (form.message as string) ?? 'Berhasil';
			errorMsg = '';
		} else if (form?.message) {
			errorMsg = form.message as string;
			message = '';
		}
	});

	function handleProgramSelect(value: string) {
		programId = value;
		if (value) {
			goto(`/offerings?programId=${value}`, { replaceState: true });
		} else {
			goto('/offerings', { replaceState: true });
		}
	}

	function editOffering(offering: Offering) {
		offeringCrud.editItem = {
			...offering,
			benefits: (offering.benefits ?? []).map((f) => f.content).join('\n')
		};
		offeringCrud.showEdit = true;
	}
</script>

<svelte:head>
	<title>Offerings | Admin Nuwaira</title>
</svelte:head>

<!-- Create Dialog -->
<DataTableFormDialog
	bind:open={offeringCrud.showCreate}
	mode="create"
	schema={createSchema}
	action="?/create"
	title="Tambah Offering"
/>

<!-- Edit Dialog -->
{#if offeringCrud.showEdit && offeringCrud.editItem}
	<DataTableFormDialog
		bind:open={offeringCrud.showEdit}
		mode="edit"
		data={offeringCrud.editItem}
		schema={editSchema}
		action="?/update"
		title="Edit Offering"
	/>
{/if}

<!-- Delete Dialog -->
{#if offeringCrud.showDelete && offeringCrud.deleteItem}
	<DeleteDialog
		bind:open={offeringCrud.showDelete}
		id={offeringCrud.deleteItem.id}
		resourceName={offeringCrud.deleteItem.name ?? offeringCrud.deleteItem.title}
		action="?/delete"
	/>
{/if}

<div class="space-y-6">
	<header
		class="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8"
	>
		<div>
			<div class="flex items-center gap-2 text-sm font-medium text-blue-100">
				<Tag class="size-5" /> Offerings
			</div>
			<h2 class="font-raleway mt-3 text-3xl font-semibold md:text-4xl">Atur Offerings Program</h2>
		</div>
	</header>

	<section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
		<div class="mb-6 max-w-sm">
			<label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400"
				>Program</label
			>
			<FormCombobox
				name="programSelector"
				label=""
				items={data.programOptions}
				bind:value={programId}
				placeholder="Pilih program..."
				searchPlaceholder="Cari program..."
				onSelect={handleProgramSelect}
			/>
		</div>

		{#if message}
			<div
				class="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700"
			>
				{message}
			</div>
		{/if}
		{#if errorMsg}
			<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
				{errorMsg}
			</div>
		{/if}

		{#if data.selectedProgram}
			<div class="mb-5 flex items-center justify-between">
				<h3 class="font-semibold text-slate-900">Offerings ({data.offerings.length})</h3>
				<Button
					type="button"
					variant="outline"
					size="sm"
					class="rounded-full"
					onclick={() => offeringCrud.openCreate()}
				>
					<Plus class="size-3.5" /> Tambah Offering
				</Button>
			</div>

			<div class="grid gap-6">
				{#each data.offerings as offering (offering.id)}
					<div class="rounded-2xl border border-slate-200 p-5">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<h4 class="font-semibold text-slate-900">{offering.name}</h4>
								<p class="mt-1 text-sm text-slate-500">{offering.title}</p>
							</div>
							<div class="flex flex-wrap items-center gap-2">
								<span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
									>{offering.type}</span
								>
								<span
									class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
									>Rp {Number(offering.priceAmount).toLocaleString('id-ID')}</span
								>
								{#if offering.badge}
									<span
										class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
										>{offering.badge}</span
									>
								{/if}
							</div>
						</div>
						{#if offering.benefits.length > 0}
							<div class="mt-4">
								<p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Benefits</p>
								<ul class="mt-2 space-y-1">
									{#each offering.benefits as benefit}
										<li class="flex items-center gap-2 text-sm text-slate-600">
											<CheckCircle2 class="size-3.5 text-emerald-500" />{benefit.content}
										</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if offering.batches.length > 0}
							<div class="mt-4">
								<p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
									Batches ({offering.batches.length})
								</p>
								<div class="mt-2 grid gap-2 sm:grid-cols-2">
									{#each offering.batches as batch (batch.id)}
										<div class="rounded-xl border border-slate-100 bg-slate-50 p-3">
											<div class="flex items-center justify-between">
												<span class="font-medium text-slate-900">{batch.title}</span>
												<span
													class={[
														'rounded-full px-2 py-0.5 text-xs font-semibold',
														batch.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
													]}
												>
													{batch.isOpen ? 'Open' : 'Closed'}
												</span>
											</div>
											<p class="mt-1 text-xs text-slate-500">
												{batch.startDate ?? '-'} s.d. {batch.endDate ?? '-'}
											</p>
										</div>
									{/each}
								</div>
							</div>
						{/if}
						<div class="mt-4 flex gap-2">
							<Button
								type="button"
								size="sm"
								variant="outline"
								class="rounded-full"
								onclick={() => editOffering(offering)}
							>
								<SquarePen class="size-3.5" /> Edit
							</Button>
							<Button
								type="button"
								size="sm"
								variant="destructive"
								class="rounded-full"
								onclick={() => offeringCrud.openDelete(offering)}
							>
								<Trash2 class="size-3.5" /> Hapus
							</Button>
						</div>
					</div>
				{:else}
					<div class="py-16 text-center">
						<span
							class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50"
						>
							<Tag class="size-6 text-slate-300" />
						</span>
						<h3 class="text-sm font-semibold text-slate-900">Belum ada offerings</h3>
						<p class="mt-1 text-xs text-slate-400">
							Klik tombol "Tambah Offering" untuk menambah offering pertama
						</p>
					</div>
				{/each}
			</div>
		{:else if programId}
			<div class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
				Program tidak ditemukan.
			</div>
		{:else}
			<div class="py-16 text-center">
				<span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
					<Tag class="size-6 text-slate-300" />
				</span>
				<h3 class="text-sm font-semibold text-slate-900">Pilih program</h3>
				<p class="mt-1 text-xs text-slate-400">
					Pilih program di atas untuk mulai mengatur offerings
				</p>
			</div>
		{/if}
	</section>
</div>
