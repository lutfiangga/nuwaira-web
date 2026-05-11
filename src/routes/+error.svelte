<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, FileQuestion } from '@lucide/svelte';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
	<div class="space-y-6 max-w-md">
		<div class="flex justify-center">
			<div class="h-24 w-24 rounded-full bg-muted flex items-center justify-center animate-bounce">
				<FileQuestion class="h-12 w-12 text-muted-foreground" />
			</div>
		</div>

		<div class="space-y-2">
			<h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">
				{$page.status}
			</h1>
			<p class="text-xl font-semibold">Page not found</p>
			<p class="text-muted-foreground">
				Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't
				exist.
			</p>
		</div>

		<div class="pt-4">
			<Button size="lg" href="/" class="gap-2">
				<ArrowLeft class="h-4 w-4" />
				Back to Home
			</Button>
		</div>
	</div>
</div>
