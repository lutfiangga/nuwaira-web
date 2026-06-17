<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ShieldCheck } from '@lucide/svelte';

	let { eventTitle, eventSlug }: { eventTitle: string; eventSlug: string } = $props();
</script>

<div class="flex flex-col items-center rounded-[32px] border border-emerald-200 bg-white p-10 text-center shadow-lg">
	<div class="flex size-16 items-center justify-center rounded-full bg-emerald-100">
		<ShieldCheck class="size-8 text-emerald-600" />
	</div>
	<h1 class="font-raleway mt-6 text-2xl font-semibold text-slate-900">Pendaftaran Berhasil!</h1>
	<p class="mt-3 max-w-md leading-7 text-slate-600">
		Terima kasih sudah mendaftar untuk acara <strong>{eventTitle}</strong>. Tim kami akan menghubungi kamu melalui email untuk konfirmasi.
	</p>
	<div class="mt-8 flex gap-3">
		<Button href="/acara/{eventSlug}" variant="outline" class="h-11 rounded-full px-6">
			Kembali ke Acara
		</Button>
		<Button href="/acara" class="h-11 rounded-full bg-brand px-6 text-white hover:bg-brand/90">
			Lihat Acara Lain
		</Button>
	</div>
</div>
