<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { Facebook, Instagram, Linkedin, Youtube, Twitter, Github, Twitch, Send, Globe, MessageCircle } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type ProgramLink = { slug: string; title: string };
	type SocialLinkData = { platform: string; url: string; iconKey: string };

	const socialIconMap: Record<string, Component<{ class?: string }>> = {
		Instagram,
		Youtube,
		Facebook,
		Linkedin,
		Twitter,
		Github,
		Twitch,
		Send,
		Globe,
		MessageCircle
	};

	const footerPrograms = $derived(
		($page.data.publicNavigation?.programs ?? []) as ProgramLink[]
	);
	const footerSocialLinks = $derived(
		($page.data.publicNavigation?.socialLinks ?? []) as SocialLinkData[]
	);
</script>

{#snippet renderSocialIcon(key: string)}
	{#if socialIconMap[key]}
		{@const Icon = socialIconMap[key]}
		<Icon class="size-4" />
	{:else}
		<Globe class="size-4" />
	{/if}
{/snippet}

<footer class="bg-[#1f1f1f] px-5 py-12 text-white sm:px-8 lg:px-16">
	<div class="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_1fr_1fr]">
		<div class="flex flex-col items-start justify-between">
			<a href={resolve('/')} class="group">
				<img src="/images/logo-wt.svg" alt="Nuwaira Academy" class="h-12 w-auto group-hover:scale-110 transition-all duration-300" />
			</a>
			<p class="mt-10 leading-5 text-slate-400">
				Di bawah naungan<br />
				<span class="font-semibold text-amber-400">Marufi Syihab Foundation</span>
			</p>
		</div>

		<div>
			<h3 class="text-sm font-semibold">Alamat Kantor</h3>
			<p class="mt-3 max-w-sm leading-5 text-slate-400">
				Jl. Abu Nawas Zaini, Mlangi, Nogotirto, Gamping, Kabupaten Sleman, Daerah Istimewa
				Yogyakarta 55592
			</p>
			<h3 class="mt-6 text-sm font-semibold">Ikuti Kami</h3>
			<div class="mt-3 flex gap-2">
				{#each footerSocialLinks as social (social.platform)}
					<a
						href={social.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={social.platform}
						class="rounded-full bg-white p-2 text-slate-900"
					>
						{@render renderSocialIcon(social.iconKey)}
					</a>
				{/each}
			</div>
		</div>

		<div>
			<h3 class="text-sm font-semibold">Program</h3>
			{#if footerPrograms.length > 0}
				<ul class="mt-3 space-y-2 text-slate-400">
					{#each footerPrograms as program (program.slug)}
						<li>
							<a href={`/programs/${program.slug}`}>
								{program.title}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>

	<div
		class="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between"
	>
		<p>Sitemap &nbsp; Syarat & Ketentuan &nbsp; Kebijakan Privasi</p>
		<p>Copyright © 2026 Marufi Syihab foundation, Nuwaira Academy</p>
	</div>
</footer>
