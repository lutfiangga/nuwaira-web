<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Layers, Plus, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import FormCombobox from '$lib/components/forms/form-combobox.svelte';
	import { MultiCombobox } from '$lib/components/ui/combobox';

	type MilestoneItem = {
		title: string;
		weeks: string;
		description: string;
		output: string;
		technologyIds: string[];
	};

	type TechOption = { value: string; label: string; iconKey: string };

	let {
		data,
		form
	}: {
		data: {
			programOptions: { value: string; label: string }[];
			selectedProgram: { id: string; title: string } | null;
			milestones: MilestoneItem[];
			technologyOptions: TechOption[];
		};
		form?: Record<string, unknown> | null;
	} = $props();

	let milestones = $state<MilestoneItem[]>([]);
	let saving = $state(false);
	let saveMessage = $state('');
	let saveError = $state('');
	let restoredForm: Record<string, unknown> | null | undefined;
	let programId = $state($page.url.searchParams.get('programId') ?? '');

	$effect(() => {
		if (form === restoredForm) return;
		restoredForm = form;
		saving = false;

		if (form?.success) {
			saveMessage = (form.message as string) ?? 'Berhasil disimpan';
			saveError = '';
		} else if (form?.message && !form?.success) {
			saveError = form.message as string;
			saveMessage = '';
		}
	});

	$effect(() => {
		if (data.milestones && data.selectedProgram) {
			milestones = data.milestones.map((m) => ({
				title: m.title,
				weeks: m.weeks,
				description: m.description,
				output: m.output,
				technologyIds: m.technologyIds ?? []
			}));
		} else {
			milestones = [];
		}
	});

	function handleProgramSelect(value: string) {
		programId = value;
		if (value) {
			goto(`/milestones?programId=${value}`, { replaceState: true });
		} else {
			goto('/milestones', { replaceState: true });
		}
	}

	function addMilestone() {
		milestones = [
			...milestones,
			{ title: '', weeks: '', description: '', output: '', technologyIds: [] }
		];
	}

	function removeMilestone(index: number) {
		milestones = milestones.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>Milestones | Admin Nuwaira</title>
</svelte:head>

<div class="space-y-6">
	<header class="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8">
		<div>
			<div class="flex items-center gap-2 text-sm font-medium text-blue-100">
				<Layers class="size-5" /> Milestones
			</div>
			<h2 class="font-raleway mt-3 text-3xl font-semibold md:text-4xl">
				Atur Tahapan Belajar
			</h2>
		</div>
	</header>

	<section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
		<div class="mb-6 max-w-sm">
			<label class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Program</label>
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

		{#if data.selectedProgram}
			<form method="post" action="?/save">
				<input type="hidden" name="programId" value={data.selectedProgram.id} />
				<input type="hidden" name="milestones" value={JSON.stringify(milestones)} />

				{#if saveMessage}
					<div class="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">{saveMessage}</div>
				{/if}
				{#if saveError}
					<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{saveError}</div>
				{/if}

				<div class="grid gap-4">
					{#each milestones as milestone, i (i)}
						<div class="rounded-2xl border border-slate-100 bg-slate-50 p-5">
							<div class="mb-5 flex items-center justify-between">
								<div class="flex items-center gap-3">
									<span class="flex size-8 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">{i + 1}</span>
									<h3 class="font-semibold text-slate-900">Milestone {i + 1}</h3>
								</div>
								<button
									type="button"
									onclick={() => removeMilestone(i)}
									class="flex size-8 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500"
									aria-label="Hapus milestone"
								>
									<Trash2 class="size-4" />
								</button>
							</div>

							<div class="grid gap-4">
								<div class="grid grid-cols-4 gap-4">
									<div class="col-span-3 space-y-1.5">
										<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</label>
										<Input bind:value={milestone.title} required placeholder="Nama tahapan" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
									</div>
									<div class="space-y-1.5">
										<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Duration</label>
										<Input bind:value={milestone.weeks} required placeholder="cth: 4 minggu" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
									</div>
								</div>

								<div class="grid grid-cols-2 gap-4">
									<div class="space-y-1.5">
										<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</label>
										<Textarea bind:value={milestone.description} required rows={2} placeholder="Deskripsi tahapan" class="rounded-xl border-slate-200 bg-white text-sm shadow-none" />
									</div>
									<div class="space-y-1.5">
										<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Output</label>
										<Textarea bind:value={milestone.output} required rows={2} placeholder="Hasil yang dicapai" class="rounded-xl border-slate-200 bg-white text-sm shadow-none" />
									</div>
								</div>

								<div class="space-y-1.5">
									<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Technologies</label>
									<MultiCombobox
										items={data.technologyOptions}
										bind:values={milestone.technologyIds}
										placeholder="Pilih teknologi..."
										searchPlaceholder="Cari teknologi..."
									/>
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if milestones.length === 0}
					<div class="py-16 text-center">
						<span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
							<Layers class="size-6 text-slate-300" />
						</span>
						<h3 class="text-sm font-semibold text-slate-900">Belum ada milestones</h3>
						<p class="mt-1 text-xs text-slate-400">Klik tombol di bawah untuk menambah milestone pertama</p>
					</div>
				{/if}

				<div class="mt-6 flex items-center gap-3">
					<Button type="submit" disabled={saving} class="rounded-full bg-brand px-8 text-white hover:bg-brand/90">
						{saving ? 'Menyimpan...' : 'Simpan Milestones'}
					</Button>
					<Button type="button" variant="outline" onclick={addMilestone} class="rounded-full border-dashed px-6">
						<Plus class="size-4" />
						Tambah Milestone
					</Button>
				</div>
			</form>
		{:else if programId}
			<div class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">Program tidak ditemukan.</div>
		{:else}
			<div class="py-16 text-center">
				<span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
					<Layers class="size-6 text-slate-300" />
				</span>
				<h3 class="text-sm font-semibold text-slate-900">Pilih program</h3>
				<p class="mt-1 text-xs text-slate-400">Pilih program di atas untuk mulai mengatur milestone</p>
			</div>
		{/if}
	</section>
</div>
