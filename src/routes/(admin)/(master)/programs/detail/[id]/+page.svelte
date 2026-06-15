<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowLeft,
		ArrowRight,
		CalendarDays,
		Eye,
		EyeOff,
		GraduationCap,
		Layers,
		Package,
		SquarePen,
		Star,
		Target,
		BarChart3,
		Tag
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { CrudState } from '$lib/app/helpers/crud.state.svelte';
	import DataTableFormDialog from '$lib/components/custom-table/data-table-form-dialog.svelte';
	import { getEditProgramFormSchema } from '$lib/app/modules/program/forms/program.form';

	let { data, form } = $props();

	const program = $derived(data.program);
	const basicInfoCrud = new CrudState();
	const editProgramSchema = $derived(getEditProgramFormSchema());

	let message = $state('');
	let errorMsg = $state('');
	let restoredForm: Record<string, unknown> | null | undefined;

	$effect(() => {
		if (form === restoredForm) return;
		restoredForm = form;
		if (form?.success) {
			message = 'Program berhasil diupdate';
			errorMsg = '';
		} else if (form?.message) {
			errorMsg = form.message as string;
			message = '';
		}
	});

	function formatDate(d: string | Date | null | undefined) {
		if (!d) return '-';
		try {
			return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
		} catch { return String(d); }
	}

	const navCards = $derived([
		{ label: 'Intro Section', icon: Target, href: `/intros?programId=${program.id}`, count: program.intro ? 1 : 0, unit: 'item' },
		{ label: 'Metrics', icon: BarChart3, href: `/metrics?programId=${program.id}`, count: program.metrics?.length ?? 0, unit: 'items' },
		{ label: 'Milestones', icon: Layers, href: `/milestones?programId=${program.id}`, count: program.milestones?.length ?? 0, unit: 'items' },
		{ label: 'Offerings', icon: Tag, href: `/offerings?programId=${program.id}`, count: program.offerings?.length ?? 0, unit: 'items' }
	]);
</script>

<svelte:head>
	<title>{program.title} | Admin Program</title>
</svelte:head>

<!-- Basic Info Edit Dialog -->
{#if basicInfoCrud.showEdit && basicInfoCrud.editItem}
	<DataTableFormDialog
		bind:open={basicInfoCrud.showEdit}
		mode="edit"
		data={basicInfoCrud.editItem}
		schema={editProgramSchema}
		action={resolve('/programs') + '?/update'}
		title="Edit Program"
	/>
{/if}

<div class="space-y-6">
	<Button href={resolve('/programs')} variant="outline" class="rounded-xl bg-white">
		<ArrowLeft class="size-4" />
		Kembali ke daftar program
	</Button>

	<header class="rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8">
		<div class="flex flex-col gap-5">
			<div class="flex items-center gap-4">
				<div class="flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
					<GraduationCap class="size-8" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm text-white/65">Detail Program</p>
					<h2 class="font-raleway mt-1 text-3xl font-semibold md:text-4xl">{program.title}</h2>
					<p class="mt-2 text-white/80">{program.eyebrow}</p>
				</div>
				<div class="flex shrink-0 flex-wrap items-center gap-2">
					<span class={['inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold', program.status === 'published' ? 'bg-emerald-400/20 text-emerald-100' : program.status === 'draft' ? 'bg-amber-300/20 text-amber-100' : 'bg-slate-400/20 text-slate-200']}>
						{#if program.status === 'published'}<Eye class="size-4" />{:else if program.status === 'draft'}<EyeOff class="size-4" />{:else}<Package class="size-4" />{/if}
						{program.status}
					</span>
					<span class={['inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold', program.isActive ? 'bg-emerald-400/20 text-emerald-100' : 'bg-slate-400/20 text-slate-200']}>
						{program.isActive ? 'Active' : 'Inactive'}
					</span>
				</div>
			</div>
		</div>
	</header>

	{#if message}
		<div class="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">{message}</div>
	{/if}
	{#if errorMsg}
		<div class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{errorMsg}</div>
	{/if}

	<!-- Basic Info Card -->
	<section class="rounded-3xl border border-slate-200 bg-white p-6">
		<div class="flex items-center justify-between">
			<h3 class="font-raleway flex items-center gap-3 text-xl font-semibold">
				<Star class="size-5 text-brand" />
				Informasi Dasar
			</h3>
			<Button type="button" variant="outline" size="sm" class="rounded-full" onclick={() => {
				basicInfoCrud.editItem = { ...program };
				basicInfoCrud.showEdit = true;
			}}>
				<SquarePen class="size-3.5" /> Edit
			</Button>
		</div>
		<dl class="mt-6 grid gap-5 sm:grid-cols-2">
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Slug</dt>
				<dd class="mt-1 font-mono text-slate-800">{program.slug}</dd>
			</div>
			<div>
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Dibuat</dt>
				<dd class="mt-1 flex items-center gap-2 text-slate-800">
					<CalendarDays class="size-4 text-brand" />
					{formatDate(program.createdAt)}
				</dd>
			</div>
			<div class="sm:col-span-2">
				<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Summary</dt>
				<dd class="mt-2 leading-6 text-slate-800">{program.summary}</dd>
			</div>
		</dl>

		<div class="mt-6 rounded-2xl bg-slate-50 p-4">
			<p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Hero Image</p>
			<img src={program.heroImage} alt={program.heroImageAlt} class="mt-3 h-48 w-full rounded-xl object-cover" />
			<p class="mt-2 text-sm text-slate-600">{program.heroImageAlt}</p>
		</div>
	</section>

	<!-- Navigation Cards -->
	<section>
		<h3 class="font-raleway mb-4 text-lg font-semibold text-slate-700">Kelola Konten Program</h3>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each navCards as card (card.label)}
				<a
					href={card.href}
					class="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand/30 hover:shadow-md"
				>
					<div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
						<card.icon class="size-5" />
					</div>
					<div class="min-w-0 flex-1">
						<h4 class="font-semibold text-slate-900">{card.label}</h4>
						<p class="text-sm text-slate-500">{card.count} {card.unit}</p>
					</div>
					<ArrowRight class="size-4 shrink-0 text-slate-300 transition group-hover:text-brand" />
				</a>
			{/each}
		</div>
	</section>
</div>
