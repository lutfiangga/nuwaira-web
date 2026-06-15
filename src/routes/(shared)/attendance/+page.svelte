<script lang="ts">let { data } = $props();</script>

<div class="rounded-xl border bg-white">
	<header class="border-b p-5">
		<h2 class="font-semibold">Attendance</h2>
		<p class="mt-1 text-sm text-slate-500">Riwayat kehadiran per sesi dan enrollment.</p>
	</header>
	<div class="overflow-x-auto">
		<table class="w-full min-w-[760px] text-left text-sm">
			<thead class="bg-slate-50 text-slate-500"><tr>{#if data.isAdmin}<th class="p-4">Siswa</th>{/if}<th class="p-4">Program</th><th class="p-4">Sesi</th><th class="p-4">Tanggal</th><th class="p-4">Status</th></tr></thead>
			<tbody class="divide-y">
				{#each data.records as record (record.id)}
					<tr>
						{#if data.isAdmin}<td class="p-4 font-medium">{record.studentName}</td>{/if}
						<td class="p-4">{record.programTitle}<p class="text-xs text-slate-500">{record.batchTitle}</p></td>
						<td class="p-4">{record.sessionTitle}<p class="text-xs text-slate-500">{record.startTime} - {record.endTime}</p></td>
						<td class="p-4">{record.sessionDate}</td>
						<td class="p-4 capitalize">{record.status}</td>
					</tr>
				{:else}
					<tr><td colspan={data.isAdmin ? 5 : 4} class="p-8 text-center text-slate-500">Belum ada data attendance.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
