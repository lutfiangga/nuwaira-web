<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowLeft,
		Bot,
		CalendarDays,
		Check,
		CheckCircle2,
		Clock3,
		Code2,
		Mail,
		MapPin,
		Phone,
		ShieldCheck,
		UserRound,
		UsersRound,
		X,
		XCircle
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	const student = $derived(data.student);
	const location = $derived(
		[student.villageName, student.districtName, student.regencyName, student.provinceName].join(
			', '
		)
	);
	const birthDate = $derived(
		new Date(`${student.birthDate}T00:00:00`).toLocaleDateString('id-ID', {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		})
	);
</script>

<svelte:head>
	<title>{student.fullName} | Admin Siswa</title>
</svelte:head>

<div class="space-y-6">
	<Button
		href={student.status === 'accepted' ? resolve('/students') : resolve('/prospective-students')}
		variant="outline"
		class="rounded-xl bg-white"
	>
		<ArrowLeft class="size-4" />
		Kembali ke {student.status === 'accepted' ? 'siswa' : 'calon siswa'}
	</Button>

	<header
		class="rounded-3xl bg-[linear-gradient(135deg,#092A77,#164DC7)] p-6 text-white md:p-8"
	>
		<div class="flex flex-col gap-5 sm:flex-row sm:items-center">
			<div class="flex size-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
				<UserRound class="size-9" />
			</div>
			<div class="min-w-0 flex-1">
				<p class="text-sm text-white/65">Profil pendaftaran siswa</p>
				<h2 class="font-raleway mt-1 text-3xl font-semibold md:text-4xl">{student.fullName}</h2>
				<div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
					<span class="flex items-center gap-2"><Mail class="size-4" />{student.email}</span>
					<span class="flex items-center gap-2"><Phone class="size-4" />{student.whatsapp}</span>
				</div>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<span
					class={[
						'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold',
						student.status === 'accepted'
							? 'bg-emerald-400/20 text-emerald-100'
							: student.status === 'pending'
								? 'bg-amber-300/20 text-amber-100'
								: 'bg-red-300/20 text-red-100'
					]}
				>
					{#if student.status === 'accepted'}
						<CheckCircle2 class="size-4" /> Diterima
					{:else if student.status === 'pending'}
						<Clock3 class="size-4" /> Pending
					{:else}
						<XCircle class="size-4" /> Ditolak
					{/if}
				</span>
				{#if student.status === 'pending'}
					<form method="POST" action="?/accept">
						<Button type="submit" class="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600">
							<Check class="size-4" />
							Terima
						</Button>
					</form>
					<form method="POST" action="?/reject">
						<Button type="submit" variant="destructive" class="rounded-xl">
							<X class="size-4" />
							Tolak
						</Button>
					</form>
				{/if}
			</div>
		</div>
	</header>

	<div class="grid gap-6 xl:grid-cols-2">
		<section class="rounded-3xl border border-slate-200 bg-white p-6">
			<h3 class="font-raleway flex items-center gap-3 text-xl font-semibold">
				<ShieldCheck class="size-5 text-brand" />
				Data Diri
			</h3>
			<dl class="mt-6 grid gap-5 sm:grid-cols-2">
				<div>
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">NIK</dt>
					<dd class="mt-1 font-mono font-semibold text-slate-900">{student.nik ?? '-'}</dd>
				</div>
				<div>
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
						Tanggal lahir
					</dt>
					<dd class="mt-1 flex items-center gap-2 text-slate-800">
						<CalendarDays class="size-4 text-brand" />
						{birthDate}
					</dd>
				</div>
				<div>
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
						Pendidikan aktif
					</dt>
					<dd class="mt-1 text-slate-800">{student.activeEducation}</dd>
				</div>
				<div>
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Agama</dt>
					<dd class="mt-1 text-slate-800">{student.religion}</dd>
				</div>
				<div class="sm:col-span-2">
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Domisili</dt>
					<dd class="mt-2 flex items-start gap-2 leading-6 text-slate-800">
						<MapPin class="mt-1 size-4 shrink-0 text-brand" />
						{location}
					</dd>
				</div>
				<div class="sm:col-span-2">
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
						Alamat lengkap
					</dt>
					<dd class="mt-2 leading-6 text-slate-800">{student.fullAddress}</dd>
				</div>
			</dl>
		</section>

		<section class="rounded-3xl border border-slate-200 bg-white p-6">
			<h3 class="font-raleway flex items-center gap-3 text-xl font-semibold">
				<UsersRound class="size-5 text-brand" />
				Data Wali
			</h3>
			<dl class="mt-6 space-y-5">
				<div>
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Nama wali</dt>
					<dd class="mt-1 text-slate-800">{student.guardianName}</dd>
				</div>
				<div>
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">Hubungan</dt>
					<dd class="mt-1 text-slate-800">{student.guardianRelation}</dd>
				</div>
				<div>
					<dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">
						WhatsApp wali
					</dt>
					<dd class="mt-1 text-slate-800">{student.guardianWhatsapp}</dd>
				</div>
			</dl>
		</section>

		<section class="rounded-3xl border border-slate-200 bg-white p-6 xl:col-span-2">
			<h3 class="font-raleway text-xl font-semibold">Informasi Program</h3>
			<div class="mt-6 grid gap-6 md:grid-cols-3">
				<div class="rounded-2xl bg-slate-50 p-5">
					<p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
						Sumber informasi
					</p>
					<p class="mt-2 font-medium text-slate-800">{student.referralSource}</p>
				</div>
				<div class="rounded-2xl bg-slate-50 p-5">
					<p
						class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
					>
						<Code2 class="size-4" />
						Basic programming
					</p>
					<p class="mt-3 flex items-center gap-2 font-medium text-slate-800">
						{#if student.hasProgrammingBasics}
							<CheckCircle2 class="size-5 text-emerald-600" /> Sudah
						{:else}
							<XCircle class="size-5 text-slate-400" /> Belum
						{/if}
					</p>
				</div>
				<div class="rounded-2xl bg-slate-50 p-5">
					<p
						class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
					>
						<Bot class="size-4" />
						Tools AI sehari-hari
					</p>
					<p class="mt-3 flex items-center gap-2 font-medium text-slate-800">
						{#if student.usesAiTools}
							<CheckCircle2 class="size-5 text-emerald-600" /> Sudah
						{:else}
							<XCircle class="size-5 text-slate-400" /> Belum
						{/if}
					</p>
				</div>
				<div class="rounded-2xl bg-blue-50 p-5 md:col-span-3">
					<p class="text-xs font-semibold uppercase tracking-wide text-brand">Tujuan program</p>
					<p class="mt-3 leading-7 text-slate-800">{student.programGoal}</p>
				</div>
			</div>
		</section>
	</div>
</div>
