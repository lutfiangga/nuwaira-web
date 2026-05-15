<script lang="ts">
	type StatusVariant = 'active' | 'paid' | 'completed' | 'pending' | 'inactive' | 'draft' | 'cancelled';

	let {
		status,
		class: className = ''
	}: {
		status: string;
		class?: string;
	} = $props();

	const variantMap: Record<StatusVariant, string> = {
		active: 'bg-emerald-100 text-emerald-700',
		paid: 'bg-emerald-100 text-emerald-700',
		completed: 'bg-sky-100 text-sky-700',
		pending: 'bg-amber-100 text-amber-700',
		inactive: 'bg-slate-100 text-slate-500',
		draft: 'bg-slate-100 text-slate-500',
		cancelled: 'bg-rose-100 text-rose-700'
	};

	const variantClass = $derived(
		variantMap[status.toLowerCase() as StatusVariant] || 'bg-slate-100 text-slate-500'
	);
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold {variantClass} {className}">
	{status}
</span>
