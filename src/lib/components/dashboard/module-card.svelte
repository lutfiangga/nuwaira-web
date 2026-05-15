<script lang="ts">
	let {
		Icon,
		label,
		value,
		href
	}: {
		Icon: any;
		label: string;
		value: number;
		href: string;
	} = $props();
</script>

<article class="rounded-2xl border bg-card p-5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all group">
	<div class="flex items-center justify-between">
		<div class="rounded-xl bg-primary/10 p-2.5 text-primary group-hover:scale-110 transition-transform">
			<Icon class="h-5 w-5" />
		</div>
		<a {href} class="text-sm text-muted-foreground hover:text-primary transition-colors">Open</a>
	</div>
	<p class="mt-4 text-3xl font-bold tracking-tight">{value}</p>
	<p class="text-sm text-muted-foreground">{label}</p>
</article>
