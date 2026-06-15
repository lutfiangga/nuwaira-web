<script lang="ts">
	import { MessageCircleQuestion, Plus, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	type FaqItem = {
		question: string;
		answer: string;
	};

	let {
		data,
		form
	}: {
		data: { faqs: (FaqItem & { id: string })[] };
		form?: Record<string, unknown> | null;
	} = $props();

	let faqs = $state<FaqItem[]>([]);
	let saving = $state(false);
	let saveMessage = $state('');
	let saveError = $state('');
	let restoredForm: Record<string, unknown> | null | undefined;

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
		if (data.faqs) {
			faqs = data.faqs.map((f) => ({
				question: f.question,
				answer: f.answer
			}));
		} else {
			faqs = [];
		}
	});

	function addFaq() {
		faqs = [...faqs, { question: '', answer: '' }];
	}

	function removeFaq(index: number) {
		faqs = faqs.filter((_, i) => i !== index);
	}

	function moveUp(index: number) {
		if (index === 0) return;
		const updated = [...faqs];
		[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
		faqs = updated;
	}

	function moveDown(index: number) {
		if (index === faqs.length - 1) return;
		const updated = [...faqs];
		[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
		faqs = updated;
	}
</script>

<svelte:head>
	<title>FAQ | Admin Nuwaira</title>
</svelte:head>

<div class="space-y-6">
	<header class="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8">
		<div>
			<div class="flex items-center gap-2 text-sm font-medium text-blue-100">
				<MessageCircleQuestion class="size-5" /> FAQ
			</div>
			<h2 class="font-raleway mt-3 text-3xl font-semibold md:text-4xl">
				Kelola Pertanyaan Umum
			</h2>
		</div>
	</header>

	<section class="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
		<form method="post" action="?/save">
			<input type="hidden" name="faqs" value={JSON.stringify(faqs)} />

			{#if saveMessage}
				<div class="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">{saveMessage}</div>
			{/if}
			{#if saveError}
				<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{saveError}</div>
			{/if}

			<div class="grid gap-4">
				{#each faqs as faq, i (i)}
					<div class="rounded-2xl border border-slate-100 bg-slate-50 p-5">
						<div class="mb-4 flex items-center justify-between">
							<div class="flex items-center gap-3">
								<span class="flex size-8 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">{i + 1}</span>
								<h3 class="font-semibold text-slate-900">FAQ {i + 1}</h3>
							</div>
							<div class="flex items-center gap-1">
								<button
									type="button"
									onclick={() => moveUp(i)}
									disabled={i === 0}
									class="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30"
									aria-label="Pindah ke atas"
								>
									<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
								</button>
								<button
									type="button"
									onclick={() => moveDown(i)}
									disabled={i === faqs.length - 1}
									class="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30"
									aria-label="Pindah ke bawah"
								>
									<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
								</button>
								<button
									type="button"
									onclick={() => removeFaq(i)}
									class="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
									aria-label="Hapus FAQ"
								>
									<Trash2 class="size-4" />
								</button>
							</div>
						</div>

						<div class="grid gap-4">
							<div class="space-y-1.5">
								<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Pertanyaan</label>
								<Input bind:value={faq.question} required placeholder="Tulis pertanyaan..." class="h-10 rounded-xl border-slate-200 bg-white text-sm shadow-none" />
							</div>
							<div class="space-y-1.5">
								<label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Jawaban</label>
								<Textarea bind:value={faq.answer} required rows={3} placeholder="Tulis jawaban..." class="rounded-xl border-slate-200 bg-white text-sm shadow-none" />
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if faqs.length === 0}
				<div class="py-16 text-center">
					<span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
						<MessageCircleQuestion class="size-6 text-slate-300" />
					</span>
					<h3 class="text-sm font-semibold text-slate-900">Belum ada FAQ</h3>
					<p class="mt-1 text-xs text-slate-400">Klik tombol di bawah untuk menambah FAQ pertama</p>
				</div>
			{/if}

			<div class="mt-6 flex items-center gap-3">
				<Button type="submit" disabled={saving} class="rounded-full bg-brand px-8 text-white hover:bg-brand/90">
					{saving ? 'Menyimpan...' : 'Simpan FAQ'}
				</Button>
				<Button type="button" variant="outline" onclick={addFaq} class="rounded-full border-dashed px-6">
					<Plus class="size-4" />
					Tambah FAQ
				</Button>
			</div>
		</form>
	</section>
</div>
