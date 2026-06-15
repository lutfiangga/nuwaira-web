<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Target, Save, Plus, Trash2, CheckCircle2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import FormCombobox from '$lib/components/forms/form-combobox.svelte';

	type PageData = {
		programOptions: { value: string; label: string }[];
		selectedProgram: { id: string; title: string } | null;
		intro: {
			introEyebrow: string;
			introTitle: string;
			introImage: string;
			introImageAlt: string;
			deskripsi: string[];
			learningBackground: string[];
		} | null;
	};

	let {
		data,
		form
	}: {
		data: PageData;
		form?: Record<string, unknown> | null;
	} = $props();

	let programId = $state($page.url.searchParams.get('programId') ?? '');
	let eyebrow = $state('');
	let title = $state('');
	let imageAlt = $state('');
	let existingImage = $state('');
	let deskripsi = $state<string[]>([]);
	let learningBackground = $state<string[]>([]);
	let saveMessage = $state('');
	let saveError = $state('');
	let restoredForm: Record<string, unknown> | null | undefined;

	$effect(() => {
		if (form === restoredForm) return;
		restoredForm = form;
		if (form?.success) {
			saveMessage = (form.message as string) ?? 'Berhasil disimpan';
			saveError = '';
		} else if (form?.message && !form?.success) {
			saveError = form.message as string;
			saveMessage = '';
		}
	});

	$effect(() => {
		if (data.intro) {
			eyebrow = data.intro.introEyebrow ?? '';
			title = data.intro.introTitle ?? '';
			imageAlt = data.intro.introImageAlt ?? '';
			existingImage = data.intro.introImage ?? '';
			deskripsi = data.intro.deskripsi ?? [];
			learningBackground = data.intro.learningBackground ?? [];
		} else {
			eyebrow = '';
			title = '';
			imageAlt = '';
			existingImage = '';
			deskripsi = [];
			learningBackground = [];
		}
	});

	function handleProgramSelect(value: string) {
		programId = value;
		if (value) {
			goto(`/intros?programId=${value}`, { replaceState: true });
		} else {
			goto('/intros', { replaceState: true });
		}
	}

	function addParagraph() {
		deskripsi = [...deskripsi, ''];
	}
	function removeParagraph(index: number) {
		deskripsi = deskripsi.filter((_, i) => i !== index);
	}
	function addChecklist() {
		learningBackground = [...learningBackground, ''];
	}
	function removeChecklist(index: number) {
		learningBackground = learningBackground.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>Intro Section | Admin Nuwaira</title>
</svelte:head>

<div class="space-y-6">
	<header class="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8">
		<div>
			<div class="flex items-center gap-2 text-sm font-medium text-blue-100">
				<Target class="size-5" /> Intro Section
			</div>
			<h2 class="font-raleway mt-3 text-3xl font-semibold md:text-4xl">
				Atur Intro Program
			</h2>
		</div>
	</header>

	<section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
		<div class="mb-6 max-w-sm">
			<label for="programSelector" class="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Program</label>
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
			<form method="post" action="?/save" enctype="multipart/form-data">
				<input type="hidden" name="programId" value={data.selectedProgram.id} />
				<input type="hidden" name="introImage_existing" value={existingImage} />
				<input type="hidden" name="deskripsi" value={JSON.stringify(deskripsi)} />
				<input type="hidden" name="learningBackground" value={JSON.stringify(learningBackground)} />

				{#if saveMessage}
					<div class="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">{saveMessage}</div>
				{/if}
				{#if saveError}
					<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{saveError}</div>
				{/if}

				<!-- Intro Fields -->
				<div class="grid gap-5">
					<h3 class="font-semibold text-slate-900">Informasi Intro</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-1.5">
							<label for="introEyebrow" class="text-xs font-semibold uppercase tracking-wide text-slate-400">Eyebrow</label>
							<Input name="introEyebrow" bind:value={eyebrow} required placeholder="cth: Tentang Program" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
						</div>
						<div class="space-y-1.5">
							<label for="introTitle" class="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</label>
							<Input name="introTitle" bind:value={title} required placeholder="cth: Kamu Harus Mulai Bersama Nuwaira" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
						</div>
					</div>

					<div class="space-y-1.5">
						<label for="introImage" class="text-xs font-semibold uppercase tracking-wide text-slate-400">Intro Image</label>
						{#if existingImage}
							<div class="mb-3 rounded-xl bg-slate-50 p-3">
								<img src={existingImage} alt="Current intro" class="h-32 w-full rounded-lg object-cover" />
							</div>
						{/if}
						<Input name="introImage" type="file" accept="image/*" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
					</div>

					<div class="space-y-1.5">
						<label for="introImageAlt" class="text-xs font-semibold uppercase tracking-wide text-slate-400">Image Alt Text</label>
						<Input name="introImageAlt" bind:value={imageAlt} required placeholder="Deskripsi gambar intro" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
					</div>
				</div>

				<!-- Deskripsi Section -->
				<div class="mt-8 border-t border-slate-100 pt-6">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="font-semibold text-slate-900">Deskripsi ({deskripsi.length})</h3>
						<Button type="button" variant="outline" size="sm" class="rounded-full border-dashed" onclick={addParagraph}>
							<Plus class="size-3.5" /> Tambah Deskripsi
						</Button>
					</div>

					<div class="grid gap-3">
						{#each deskripsi as paragraph, i (i)}
							<div class="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
								<span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">{i + 1}</span>
								<div class="min-w-0 flex-1">
									<Textarea bind:value={deskripsi[i]} rows={3} placeholder="Isi deskripsi..." class="rounded-xl border-slate-200 bg-white text-sm shadow-none" />
								</div>
								<button
									type="button"
									onclick={() => removeParagraph(i)}
									class="flex size-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500"
								>
									<Trash2 class="size-4" />
								</button>
							</div>
						{/each}
					</div>

					{#if deskripsi.length === 0}
						<div class="rounded-2xl border border-dashed border-slate-200 py-8 text-center">
							<p class="text-sm text-slate-400">Belum ada deskripsi. Klik "Tambah Deskripsi" untuk menambah.</p>
						</div>
					{/if}
				</div>

				<!-- Learning Background Section -->
				<div class="mt-6 border-t border-slate-100 pt-6">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="font-semibold text-slate-900">Learning Background ({learningBackground.length})</h3>
						<Button type="button" variant="outline" size="sm" class="rounded-full border-dashed" onclick={addChecklist}>
							<Plus class="size-3.5" /> Tambah Learning Background
						</Button>
					</div>

					<div class="grid gap-3">
						{#each learningBackground as item, i (i)}
							<div class="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
								<CheckCircle2 class="mt-2 size-5 shrink-0 text-emerald-500" />
								<div class="min-w-0 flex-1">
									<Input bind:value={learningBackground[i]} placeholder="Isi learning background..." class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
								</div>
								<button
									type="button"
									onclick={() => removeChecklist(i)}
									class="flex size-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500"
								>
									<Trash2 class="size-4" />
								</button>
							</div>
						{/each}
					</div>

					{#if learningBackground.length === 0}
						<div class="rounded-2xl border border-dashed border-slate-200 py-8 text-center">
							<p class="text-sm text-slate-400">Belum ada learning background. Klik "Tambah Learning Background" untuk menambah.</p>
						</div>
					{/if}
				</div>

				<!-- Submit -->
				<div class="mt-8 border-t border-slate-100 pt-6">
					<Button type="submit" class="rounded-full bg-brand px-8 text-white hover:bg-brand/90">
						<Save class="size-4" />
						Simpan Intro
					</Button>
				</div>
			</form>
		{:else if programId}
			<div class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">Program tidak ditemukan.</div>
		{:else}
			<div class="py-16 text-center">
				<span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
					<Target class="size-6 text-slate-300" />
				</span>
				<h3 class="text-sm font-semibold text-slate-900">Pilih program</h3>
				<p class="mt-1 text-xs text-slate-400">Pilih program di atas untuk mulai mengatur intro section</p>
			</div>
		{/if}
	</section>
</div>
