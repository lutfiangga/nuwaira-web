<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	let { token = $bindable(''), theme = 'light' }: { token?: string; theme?: 'light' | 'dark' | 'auto' } = $props();

	let container: HTMLDivElement | null = null;

	onMount(() => {
		if (!browser) return;

		const script = document.querySelector('#cf-turnstile-script');
		if (script) return renderWidget();

		const el = document.createElement('script');
		el.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		el.id = 'cf-turnstile-script';
		el.async = true;
		el.onload = renderWidget;
		document.head.appendChild(el);
	});

	function renderWidget() {
		const el = container;
		if (!el || !window.turnstile) return;

		window.turnstile.render(el, {
			sitekey: PUBLIC_TURNSTILE_SITE_KEY,
			theme,
			callback: (t: unknown) => { token = t as string; },
			'expired-callback': () => { token = ''; }
		});
	}
</script>

<div bind:this={container}></div>
