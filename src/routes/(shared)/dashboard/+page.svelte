<script lang="ts">
	import {
		ArrowUpRight,
		BarChart3,
		Building2,
		GraduationCap,
		Mail,
		Phone,
		UserCog,
		UsersRound
	} from '@lucide/svelte';

	let { data } = $props();

	const student = $derived(data.student);
	const admin = $derived(data.admin);
	const typeLabel = $derived(student?.studentType === 'business' ? 'Business' : 'Personal');
	const totalStudents = $derived(admin?.summary.totalStudents ?? 0);
	const totalBusiness = $derived(admin?.summary.totalBusiness ?? 0);
	const totalPersonal = $derived(admin?.summary.totalPersonal ?? 0);
	const businessShare = $derived(
		totalStudents > 0 ? Math.round((totalBusiness / totalStudents) * 100) : 0
	);
	const personalShare = $derived(
		totalStudents > 0 ? Math.round((totalPersonal / totalStudents) * 100) : 0
	);
</script>

<svelte:head>
	<title>Dashboard | Nuwaira Academy</title>
</svelte:head>

<div>
	{#if data.view === 'admin' && admin}
		<section class="mx-auto w-full space-y-5">
			<div class="grid gap-5 xl:grid-cols-[1.45fr_0.55fr]">
				<header class="rounded-lg border bg-white p-6">
					<div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<h2 class="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950">
								Monitoring pendaftaran bootcamp
							</h2>
							<p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
								Pantau komposisi pendaftar, akses data user, dan lihat daftar siswa terbaru dalam
								satu panel.
							</p>
						</div>
						<a
							href="/users"
							class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#092A77] px-4 text-sm font-medium text-white hover:bg-slate-800"
						>
							Kelola users
							<ArrowUpRight class="h-4 w-4" />
						</a>
					</div>
				</header>

				<div class="rounded-lg border bg-[#092A77] p-6 text-white">
					<div class="flex h-full flex-col justify-between gap-6">
						<div>
							<p class="text-sm font-medium text-blue-200">Komposisi jalur</p>
							<p class="mt-2 text-3xl font-semibold">{businessShare}%</p>
							<p class="mt-1 text-sm text-white/65">pendaftar memilih jalur business</p>
						</div>
						<div class="space-y-3">
							<div>
								<div class="mb-1 flex justify-between text-xs text-white/70">
									<span>Personal</span>
									<span>{personalShare}%</span>
								</div>
								<div class="h-2 rounded-full bg-white/10">
									<div
										class="h-2 rounded-full bg-blue-300"
										style={`width: ${personalShare}%`}
									></div>
								</div>
							</div>
							<div>
								<div class="mb-1 flex justify-between text-xs text-white/70">
									<span>Business</span>
									<span>{businessShare}%</span>
								</div>
								<div class="h-2 rounded-full bg-white/10">
									<div
										class="h-2 rounded-full bg-emerald-300"
										style={`width: ${businessShare}%`}
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div class="rounded-lg border bg-white p-5 shadow-sm">
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium text-slate-500">Total Users</p>
						<UsersRound class="h-5 w-5 text-blue-700" />
					</div>
					<p class="mt-4 text-3xl font-semibold text-slate-950">{admin.summary.totalUsers}</p>
					<p class="mt-1 text-xs text-slate-500">Semua akun aktif di sistem</p>
				</div>
				<div class="rounded-lg border bg-white p-5 shadow-sm">
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium text-slate-500">Siswa</p>
						<GraduationCap class="h-5 w-5 text-blue-700" />
					</div>
					<p class="mt-4 text-3xl font-semibold text-slate-950">{admin.summary.totalStudents}</p>
					<p class="mt-1 text-xs text-slate-500">Total pendaftar bootcamp</p>
				</div>
				<div class="rounded-lg border bg-white p-5 shadow-sm">
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium text-slate-500">Admin</p>
						<UserCog class="h-5 w-5 text-blue-700" />
					</div>
					<p class="mt-4 text-3xl font-semibold text-slate-950">{admin.summary.totalAdmins}</p>
					<p class="mt-1 text-xs text-slate-500">Akun pengelola panel</p>
				</div>
				<div class="rounded-lg border bg-white p-5 shadow-sm">
					<div class="flex items-center justify-between">
						<p class="text-sm font-medium text-slate-500">Business</p>
						<Building2 class="h-5 w-5 text-blue-700" />
					</div>
					<p class="mt-4 text-3xl font-semibold text-slate-950">{admin.summary.totalBusiness}</p>
					<p class="mt-1 text-xs text-slate-500">Pendaftar jalur business</p>
				</div>
			</div>

			<div class="grid gap-5 lg:grid-cols-[0.68fr_0.32fr]">
				<div class="rounded-lg border bg-white">
					<div class="flex items-center justify-between border-b px-5 py-4">
						<div>
							<h2 class="font-semibold text-slate-950">Pendaftar Siswa</h2>
							<p class="text-sm text-slate-500">Data singkat pendaftar bootcamp terbaru.</p>
						</div>
						<a href="/users" class="text-sm font-medium text-blue-700 hover:text-blue-800">
							Lihat semua
						</a>
					</div>
					<div class="overflow-x-auto">
						<table class="w-full min-w-[760px] text-left text-sm">
							<thead class="bg-slate-50 text-slate-500">
								<tr>
									<th class="px-5 py-3 font-medium">Siswa</th>
									<th class="px-5 py-3 font-medium">NIK</th>
									<th class="px-5 py-3 font-medium">Kontak</th>
									<th class="px-5 py-3 font-medium">Jalur</th>
									<th class="px-5 py-3 font-medium">Pendidikan</th>
								</tr>
							</thead>
							<tbody class="divide-y">
								{#each admin.students as item (item.id)}
									{@const initial = (item.name ?? item.email ?? '-').slice(0, 1).toUpperCase()}
									<tr class="hover:bg-slate-50/80">
										<td class="px-5 py-4">
											<div class="flex items-center gap-3">
												<div
													class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-sm font-semibold text-blue-700"
												>
													{initial}
												</div>
												<div class="min-w-0">
													<p class="truncate font-medium text-slate-900">{item.name ?? '-'}</p>
													{#if item.companyName}
														<p class="mt-0.5 truncate text-xs text-slate-500">{item.companyName}</p>
													{/if}
												</div>
											</div>
										</td>
										<td class="px-5 py-4 font-mono text-slate-600">{item.nik ?? '-'}</td>
										<td class="px-5 py-4 text-slate-600">
											<div class="space-y-1">
												<p class="flex items-center gap-2">
													<Mail class="h-3.5 w-3.5 text-slate-400" />
													<span>{item.email}</span>
												</p>
												<p class="flex items-center gap-2">
													<Phone class="h-3.5 w-3.5 text-slate-400" />
													<span>{item.phone ?? '-'}</span>
												</p>
											</div>
										</td>
										<td class="px-5 py-4">
											<span
												class={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
													item.studentType === 'business'
														? 'bg-emerald-50 text-emerald-700'
														: 'bg-blue-50 text-blue-700'
												}`}
											>
												{item.studentType === 'business' ? 'Business' : 'Personal'}
											</span>
										</td>
										<td class="px-5 py-4 text-slate-600">{item.education ?? '-'}</td>
									</tr>
								{:else}
									<tr>
										<td colspan="5" class="px-5 py-10 text-center text-slate-500">
											Belum ada pendaftar siswa.
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>

				<aside class="space-y-5">
					<div class="rounded-lg border bg-white p-5">
						<div class="flex items-center gap-2">
							<BarChart3 class="h-5 w-5 text-blue-700" />
							<h2 class="font-semibold text-slate-950">Distribusi Intake</h2>
						</div>
						<div class="mt-5 space-y-4">
							<div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-slate-600">Personal</span>
									<span class="font-medium text-slate-900">{totalPersonal}</span>
								</div>
								<div class="mt-2 h-2 rounded-full bg-slate-100">
									<div
										class="h-2 rounded-full bg-blue-600"
										style={`width: ${personalShare}%`}
									></div>
								</div>
							</div>
							<div>
								<div class="flex items-center justify-between text-sm">
									<span class="text-slate-600">Business</span>
									<span class="font-medium text-slate-900">{totalBusiness}</span>
								</div>
								<div class="mt-2 h-2 rounded-full bg-slate-100">
									<div
										class="h-2 rounded-full bg-emerald-600"
										style={`width: ${businessShare}%`}
									></div>
								</div>
							</div>
						</div>
					</div>

					<div class="rounded-lg border bg-white p-5">
						<h2 class="font-semibold text-slate-950">Aksi cepat</h2>
						<div class="mt-4 grid gap-2">
							<a
								href="/users"
								class="flex items-center justify-between rounded-md border px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
							>
								Kelola user
								<ArrowUpRight class="h-4 w-4" />
							</a>
							<a
								href="/"
								class="flex items-center justify-between rounded-md border px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
							>
								Lihat landing page
								<ArrowUpRight class="h-4 w-4" />
							</a>
						</div>
					</div>
				</aside>
			</div>
		</section>
	{:else if student}
		<section class="mx-auto w-full">
			<header
				class="flex flex-col gap-4 rounded-lg bg-[#092A77] p-6 text-white sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="flex items-center gap-4">
					{#if student.photo}
						<img
							src={student.photo}
							alt={student.name ?? 'Siswa'}
							class="h-16 w-16 rounded-lg object-cover"
						/>
					{:else}
						<div class="h-16 w-16 rounded-lg bg-white/10 flex items-center justify-center">
							<p class="font-bold text-2xl">
								{(student.name ?? student.email ?? '-').slice(0, 1).toUpperCase()}
							</p>
						</div>
					{/if}
					<div>
						<h1 class="mt-1 text-2xl font-semibold capitalize">{student.name}</h1>
						<p class="text-sm text-white/70">{student.email}</p>
					</div>
				</div>
			</header>

			<div class="mt-6 grid gap-4 md:grid-cols-4">
				<div class="rounded-lg border bg-white p-5">
					<p class="text-sm text-slate-500">NIK</p>
					<p class="mt-2 font-mono text-lg font-semibold">{student.nik ?? '-'}</p>
				</div>
				<div class="rounded-lg border bg-white p-5">
					<p class="text-sm text-slate-500">Jalur</p>
					<p class="mt-2 text-lg font-semibold">{typeLabel}</p>
					{#if student.companyName}
						<p class="mt-1 text-sm text-slate-500">{student.companyName}</p>
					{/if}
				</div>
				<div class="rounded-lg border bg-white p-5">
					<p class="text-sm text-slate-500">Pendidikan</p>
					<p class="mt-2 text-lg font-semibold">{student.education}</p>
				</div>
				<div class="rounded-lg border bg-white p-5">
					<p class="text-sm text-slate-500">No HP</p>
					<p class="mt-2 text-lg font-semibold">{student.phone}</p>
				</div>
			</div>

			<div class="mt-4 rounded-lg border bg-white p-5">
				<p class="text-sm text-slate-500">Motivasi</p>
				<p class="mt-3 leading-7 text-slate-700">{student.motivation}</p>
			</div>
		</section>
	{/if}
</div>
