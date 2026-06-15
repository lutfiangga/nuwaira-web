<script lang="ts">
	let { data } = $props();
</script>

<div class="mx-auto max-w-4xl rounded-xl border bg-white">
	<header class="border-b p-6">
		<h2 class="text-xl font-semibold">Profil</h2>
		<p class="mt-1 text-sm text-slate-500">
			Data akun dan profil siswa yang dipakai bersama di seluruh program.
		</p>
	</header>
	<div class="grid gap-5 p-6 sm:grid-cols-2">
		{#each [['Nama', data.profile?.fullName ?? data.profile?.name], ['Email', data.profile?.email], ['WhatsApp', data.profile?.phone], ['Tanggal lahir', data.profile?.birthDate], ['Pendidikan', data.profile?.activeEducation], ['Agama', data.profile?.religion], ['Domisili', [data.profile?.regencyName, data.profile?.provinceName]
					.filter(Boolean)
					.join(', ')], ['Alamat', data.profile?.fullAddress]] as item (item[0])}
			<div class="rounded-lg border bg-slate-50 p-4">
				<p class="text-xs font-medium text-slate-500">{item[0]}</p>
				<p class="mt-2 text-sm font-semibold text-slate-900">{item[1] || '-'}</p>
			</div>
		{/each}
	</div>
</div>
