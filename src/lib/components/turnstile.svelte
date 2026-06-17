<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	let { token = $bindable(''), theme = 'light' }: { token?: string; theme?: 'light' | 'dark' | 'auto' } = $props();

	let container: HTMLDivElement | null = null;
	let widgetId: string | undefined;

	onMount(() => {
		if (!browser) return;

		if (window.turnstile) {
			renderWidget();
			return;
		}

		const existing = document.querySelector('#cf-turnstile-script') as HTMLScriptElement | null;
		if (existing) {
			existing.addEventListener('load', () => renderWidget(), { once: true });
			return;
		}

		const el = document.createElement('script');
		el.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		el.id = 'cf-turnstile-script';
		el.async = true;
		el.defer = true;
		el.onload = () => renderWidget();
		document.head.appendChild(el);

		return () => {
			if (widgetId && window.turnstile) {
				window.turnstile.remove(widgetId);
			}
		};
	});

	function renderWidget() {
		if (!container || !window.turnstile) return;

		widgetId = window.turnstile.render(container, {
			sitekey: PUBLIC_TURNSTILE_SITE_KEY,
			theme,
			callback: (t: unknown) => { token = t as string; },
			'expired-callback': () => { token = ''; },
			'error-callback': () => { token = ''; }
		});
	}
</script>

<div bind:this={container}></div>
