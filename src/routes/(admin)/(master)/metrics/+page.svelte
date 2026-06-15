<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		BarChart3,
		Plus,
		Trash2,
		Clock3,
		MapPinned,
		UserRoundCheck,
		GraduationCap,
		BookOpen,
		Briefcase,
		Award,
		Users,
		Target,
		Trophy,
		Calendar,
		Zap,
		Star,
		TrendingUp,
		Rocket,
		Globe,
		Laptop,
		Code,
		Lightbulb
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import FormCombobox from '$lib/components/forms/form-combobox.svelte';

	const iconOptions = [
		{ value: 'Clock3', label: 'Clock' },
		{ value: 'MapPinned', label: 'Map Pin' },
		{ value: 'UserRoundCheck', label: 'User Check' },
		{ value: 'GraduationCap', label: 'Graduation Cap' },
		{ value: 'BookOpen', label: 'Book Open' },
		{ value: 'Briefcase', label: 'Briefcase' },
		{ value: 'Award', label: 'Award' },
		{ value: 'Users', label: 'Users' },
		{ value: 'Target', label: 'Target' },
		{ value: 'Trophy', label: 'Trophy' },
		{ value: 'Calendar', label: 'Calendar' },
		{ value: 'Zap', label: 'Zap' },
		{ value: 'Star', label: 'Star' },
		{ value: 'TrendingUp', label: 'Trending Up' },
		{ value: 'Rocket', label: 'Rocket' },
		{ value: 'Globe', label: 'Globe' },
		{ value: 'Laptop', label: 'Laptop' },
		{ value: 'Code', label: 'Code' },
		{ value: 'Lightbulb', label: 'Lightbulb' }
	];

	const iconMap: Record<string, any> = {
		Clock3,
		MapPinned,
		UserRoundCheck,
		GraduationCap,
		BookOpen,
		Briefcase,
		Award,
		Users,
		Target,
		Trophy,
		Calendar,
		Zap,
		Star,
		TrendingUp,
		Rocket,
		Globe,
		Laptop,
		Code,
		Lightbulb
	};

	type MetricItem = {
		label: string;
		value: string;
		icon: string;
		position: number;
	};

	let {
		data,
		form
	}: {
		data: {
			programOptions: { value: string; label: string }[];
			selectedProgram: { id: string; title: string } | null;
			metrics: MetricItem[];
		};
		form?: Record<string, unknown> | null;
	} = $props();

	let metrics = $state<MetricItem[]>([]);
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
		if (data.metrics && data.selectedProgram) {
			metrics = data.metrics.map((m) => ({
				label: m.label,
				value: m.value,
				icon: m.icon,
				position: m.position
			}));
		} else {
			metrics = [];
		}
	});

	function handleProgramSelect(value: string) {
		programId = value;
		if (value) {
			goto(`/metrics?programId=${value}`, { replaceState: true });
		} else {
			goto('/metrics', { replaceState: true });
		}
	}

	function addMetric() {
		metrics = [...metrics, { label: '', value: '', icon: 'Clock3', position: metrics.length + 1 }];
	}

	function removeMetric(index: number) {
		metrics = metrics.filter((_, i) => i !== index);
	}
</script>

<svelte:head>
	<title>Metrics | Admin Nuwaira</title>
</svelte:head>

{#snippet renderIcon(key: string, size: string)}
	{#if iconMap[key]}
		{@const Icon = iconMap[key]}
		<Icon class={size} />
	{/if}
{/snippet}

<div class="space-y-6">
	<header class="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8">
		<div>
			<div class="flex items-center gap-2 text-sm font-medium text-blue-100">
				<BarChart3 class="size-5" /> Metrics
			</div>
			<h2 class="font-raleway mt-3 text-3xl font-semibold md:text-4xl">
				Atur Metrics Program
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
				<input type="hidden" name="metrics" value={JSON.stringify(metrics)} />

				{#if saveMessage}
					<div class="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">{saveMessage}</div>
				{/if}
				{#if saveError}
					<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{saveError}</div>
				{/if}

				<div class="grid gap-4">
					{#each metrics as metric, i (i)}
						<div class="rounded-2xl border border-slate-100 bg-slate-50 p-5">
							<div class="mb-5 flex items-center justify-between">
								<div class="flex items-center gap-3">
									<span class="flex size-8 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">{i + 1}</span>
									<h3 class="font-semibold text-slate-900">Metric {i + 1}</h3>
								</div>
								<button
									type="button"
									onclick={() => removeMetric(i)}
									class="flex size-8 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500"
								>
									<Trash2 class="size-4" />
								</button>
							</div>

							<div class="grid gap-4 md:grid-cols-3">
								<div class="space-y-1.5">
									<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Label</label>
									<Input bind:value={metric.label} required placeholder="cth: 40 Pertemuan" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
								</div>
								<div class="space-y-1.5">
									<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Value</label>
									<Input bind:value={metric.value} required placeholder="cth: 20 Minggu" class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
								</div>
								<div class="space-y-1.5">
									<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Icon</label>
									<div class="flex items-center gap-2">
										{#if iconMap[metric.icon]}
											<div class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
												{@render renderIcon(metric.icon, 'size-5')}
											</div>
										{/if}
										<div class="min-w-0 flex-1">
											<FormCombobox
												name="icon-{i}"
												label=""
												items={iconOptions}
												bind:value={metric.icon}
												placeholder="Pilih icon..."
												searchPlaceholder="Cari icon..."
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if metrics.length === 0}
					<div class="py-16 text-center">
						<span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
							<BarChart3 class="size-6 text-slate-300" />
						</span>
						<h3 class="text-sm font-semibold text-slate-900">Belum ada metrics</h3>
						<p class="mt-1 text-xs text-slate-400">Klik tombol di bawah untuk menambah metric pertama</p>
					</div>
				{/if}

				<div class="mt-6 flex items-center gap-3">
					<Button type="submit" disabled={saving} class="rounded-full bg-brand px-8 text-white hover:bg-brand/90">
						{saving ? 'Menyimpan...' : 'Simpan Metrics'}
					</Button>
					<Button type="button" variant="outline" onclick={addMetric} class="rounded-full border-dashed px-6">
						<Plus class="size-4" />
						Tambah Metric
					</Button>
				</div>
			</form>
		{:else if programId}
			<div class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">Program tidak ditemukan.</div>
		{:else}
			<div class="py-16 text-center">
				<span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
					<BarChart3 class="size-6 text-slate-300" />
				</span>
				<h3 class="text-sm font-semibold text-slate-900">Pilih program</h3>
				<p class="mt-1 text-xs text-slate-400">Pilih program di atas untuk mulai mengatur metrics</p>
			</div>
		{/if}
	</section>
</div>
