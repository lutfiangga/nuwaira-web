<script lang="ts">
	import { ArrowRight, Check, Clock3, Mail, MapPin, Phone, UserRound, UserRoundPlus, X } from '@lucide/svelte';
	import type { ExportFormat } from '$lib/app/helpers/export.helper';
	import { ExportHelper } from '$lib/app/helpers/export.helper';
	import DataTable from '$lib/components/custom-table/data-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import { resolve } from '$app/paths';
	import { prospectiveDisplayColumns, prospectiveExportColumns } from './columns';
	import { getInitialVisibleColumns } from '$lib/types/data-table';

	let { data } = $props();

	let visibleColumns = $state(getInitialVisibleColumns(prospectiveDisplayColumns));

	function handleExport(format: ExportFormat) {
		const filename = `prospective_students_${new Date().toISOString().split('T')[0]}`;
		ExportHelper.export(format, data.students, prospectiveExportColumns, filename);
	}

	function toggleColumn(key: string) {
		visibleColumns = { ...visibleColumns, [key]: !visibleColumns[key] };
	}
</script>

<svelte:head>
	<title>Calon Siswa | Admin Nuwaira</title>
</svelte:head>

<DataTable
	data={data.students}
	columns={prospectiveDisplayColumns}
	total={data.total}
	page={data.page}
	pageSize={data.pageSize}
	search={data.search}
	basePath="/prospective-students"
	title="Calon Siswa"
	subtitle="Pendaftaran menunggu persetujuan"
	icon={UserRoundPlus}
	totalLabel="Menunggu"
	totalValue={data.total}
	searchPlaceholder="Cari nama, email, WhatsApp, kota, atau NIK..."
	visibleColumns={visibleColumns}
	onToggleColumn={toggleColumn}
	onExport={handleExport}
>
	{#snippet actions(student)}
		<div class="flex items-center gap-2">
			<Button href={resolve(`/students/${student.id}`)} variant="outline" class="rounded-xl">
				Detail <ArrowRight class="size-4" />
			</Button>
			<form method="POST" action="?/accept">
				<input type="hidden" name="id" value={student.id} />
				<Button type="submit" class="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
					<Check class="size-4" /> Terima
				</Button>
			</form>
			<form method="POST" action="?/reject">
				<input type="hidden" name="id" value={student.id} />
				<Button type="submit" variant="destructive" class="rounded-xl">
					<X class="size-4" /> Tolak
				</Button>
			</form>
		</div>
	{/snippet}
	{#snippet cell(key, item)}
		{#if key === 'student'}
			<div class="flex items-center gap-3">
				<div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand">
					<UserRound class="size-5" />
				</div>
				<div>
					<p class="font-semibold text-slate-900">{item.fullName}</p>
					<p class="mt-1 text-xs text-slate-500">Daftar {new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
				</div>
			</div>
		{:else if key === 'nik'}
			<span class="font-mono text-slate-700">{item.nik ?? '-'}</span>
		{:else if key === 'contact'}
			<div class="space-y-1.5 text-slate-600">
				<p class="flex items-center gap-2"><Mail class="size-3.5 text-slate-400" /> {item.email}</p>
				<p class="flex items-center gap-2"><Phone class="size-3.5 text-slate-400" /> {item.whatsapp}</p>
			</div>
		{:else if key === 'domicile'}
			<p class="flex items-center gap-2 text-slate-700"><MapPin class="size-4 text-brand" /> {item.regencyName}</p>
			<p class="mt-1 pl-6 text-xs text-slate-500">{item.provinceName}</p>
		{:else if key === 'status'}
			<span class="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
				<Clock3 class="size-3.5" /> Pending
			</span>
		{/if}
	{/snippet}
</DataTable>
