<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Palette, Search } from '@lucide/svelte';

	let { data, form } = $props();

	let logoPreview = $state<string | null>(null);
	let faviconPreview = $state<string | null>(null);
	let ogImagePreview = $state<string | null>(null);

	function previewFile(e: Event, setter: (v: string | null) => void) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (ev) => { setter(ev.target?.result as string); };
			reader.readAsDataURL(file);
		}
	}

	$effect(() => {
		if (data?.brand?.brandLogo) logoPreview = data.brand.brandLogo;
		if (data?.brand?.brandFavicon) faviconPreview = data.brand.brandFavicon;
		if (data?.brand?.seoOgImage) ogImagePreview = data.brand.seoOgImage;
	});
</script>

<div class="mx-auto w-full">
	<form
		method="POST"
		action="?/updateBrand"
		enctype="multipart/form-data"
		use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
	>
		{#if form?.message}
			<div
				class="rounded-xl border p-3 text-sm mb-6 {form.success
					? 'border-emerald-500 bg-emerald-50 text-emerald-800'
					: 'border-red-500 bg-red-50 text-red-800'}"
			>
				{form.message}
			</div>
		{/if}

		<Tabs.Root value="identity" class="w-full">
			<Tabs.List class="grid w-full grid-cols-2 rounded-xl bg-muted/50 p-1 mb-6">
				<Tabs.Trigger value="identity" class="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-sm">
					<Palette class="mr-2 h-4 w-4" />
					Brand Identity
				</Tabs.Trigger>
				<Tabs.Trigger value="seo" class="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-sm">
					<Search class="mr-2 h-4 w-4" />
					SEO & Analytics
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="identity" class="space-y-6">
				<div class="rounded-2xl border bg-card p-6 space-y-6">
					<div>
						<h3 class="text-lg font-semibold">Visual Identity</h3>
						<p class="text-sm text-muted-foreground">Customize brand name, logo, favicon, and primary color</p>
					</div>

					<Separator />

					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="brandName">Brand Name</Label>
							<Input id="brandName" name="brandName" type="text" value={data.brand?.brandName || ''} placeholder="Nuwaira Academy" />
						</div>

						<div class="space-y-2">
							<Label for="brandColor">Brand Color</Label>
							<div class="flex items-center gap-3">
								<Input id="brandColor" name="brandColor" type="text" value={data.brand?.brandColor || '#092A77'} placeholder="#092A77" class="font-mono max-w-40" />
								<div class="flex items-center gap-2">
									<span class="h-10 w-10 rounded-xl border shadow-inner" style="background-color: {data.brand?.brandColor || '#092A77'}"></span>
									<span class="text-xs text-muted-foreground">Preview</span>
								</div>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="cloudinaryFolder">Cloudinary Folder Prefix</Label>
							<Input id="cloudinaryFolder" name="cloudinaryFolder" type="text" value={data.brand?.cloudinaryFolder || ''} placeholder="nuwaira-prod" class="font-mono max-w-64" />
							<p class="text-xs text-muted-foreground">All uploads will be placed under this folder in Cloudinary.</p>
						</div>
					</div>

					<div class="grid gap-6 sm:grid-cols-2">
						<div class="space-y-2 rounded-xl border bg-muted/30 p-4">
							<Label for="brandLogo">Logo</Label>
							<div class="mt-3 flex items-center justify-center rounded-lg border bg-background p-4 h-24">
								{#if logoPreview}
									<img src={logoPreview} alt="Logo" class="max-h-full max-w-full object-contain" />
								{:else}
									<span class="text-sm text-muted-foreground">No logo uploaded</span>
								{/if}
							</div>
							<Input id="brandLogo" name="brandLogo" type="file" accept="image/*" onchange={(e) => previewFile(e, (v) => (logoPreview = v))} class="mt-3" />
							<input type="hidden" name="brandLogoPath" value="uploads/brand" />
							<p class="text-xs text-muted-foreground">SVG or PNG. Recommended height 40px.</p>
						</div>

						<div class="space-y-2 rounded-xl border bg-muted/30 p-4">
							<Label for="brandFavicon">Favicon</Label>
							<div class="mt-3 flex items-center justify-center rounded-lg border bg-background p-4 h-24">
								{#if faviconPreview}
									<img src={faviconPreview} alt="Favicon" class="max-h-full max-w-full object-contain" />
								{:else}
									<span class="text-sm text-muted-foreground">No favicon uploaded</span>
								{/if}
							</div>
							<Input id="brandFavicon" name="brandFavicon" type="file" accept="image/*" onchange={(e) => previewFile(e, (v) => (faviconPreview = v))} class="mt-3" />
							<input type="hidden" name="brandFaviconPath" value="uploads/brand" />
							<p class="text-xs text-muted-foreground">SVG or PNG. Recommended 32x32.</p>
						</div>
					</div>
				</div>
			</Tabs.Content>

			<Tabs.Content value="seo" class="space-y-6">
				<div class="rounded-2xl border bg-card p-6 space-y-6">
					<div>
						<h3 class="text-lg font-semibold">Meta & Social</h3>
						<p class="text-sm text-muted-foreground">Meta tags for search engines and social sharing</p>
					</div>

					<Separator />

					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="seoTitle">SEO Title</Label>
							<Input id="seoTitle" name="seoTitle" type="text" value={data.brand?.seoTitle || ''} placeholder="Nuwaira Academy - Leading Education Platform" />
						</div>

						<div class="space-y-2">
							<Label for="seoDescription">SEO Description</Label>
							<Input id="seoDescription" name="seoDescription" type="text" value={data.brand?.seoDescription || ''} placeholder="Leading Education & Training Provider..." />
						</div>

						<div class="space-y-2">
							<Label for="seoKeywords">SEO Keywords</Label>
							<Input id="seoKeywords" name="seoKeywords" type="text" value={data.brand?.seoKeywords || ''} placeholder="education, training, bootcamp" />
						</div>

						<div class="space-y-2 rounded-xl border bg-muted/30 p-4">
							<Label for="seoOgImage">OG Image (1200x630)</Label>
							<div class="mt-3 flex items-center justify-center rounded-lg border bg-background p-4 h-32">
								{#if ogImagePreview}
									<img src={ogImagePreview} alt="OG" class="max-h-full max-w-full object-contain" />
								{:else}
									<span class="text-sm text-muted-foreground">No OG image uploaded</span>
								{/if}
							</div>
							<Input id="seoOgImage" name="seoOgImage" type="file" accept="image/*" onchange={(e) => previewFile(e, (v) => (ogImagePreview = v))} class="mt-3" />
							<input type="hidden" name="seoOgImagePath" value="uploads/brand" />
							<p class="text-xs text-muted-foreground">Social share preview image. 1200x630px recommended.</p>
						</div>
					</div>
				</div>

				<div class="rounded-2xl border bg-card p-6 space-y-6">
					<div>
						<h3 class="text-lg font-semibold">Analytics</h3>
						<p class="text-sm text-muted-foreground">Google Analytics and tracking configuration</p>
					</div>

					<Separator />

					<div class="space-y-2">
						<Label for="gtagId">Google Tag Manager ID</Label>
						<Input id="gtagId" name="gtagId" type="text" value={data.brand?.gtagId || ''} placeholder="G-XXXXXXXXXX" class="font-mono max-w-72" />
						<p class="text-xs text-muted-foreground">Google Analytics 4 measurement ID. Leave empty to disable.</p>
					</div>
				</div>
			</Tabs.Content>
		</Tabs.Root>

		<div class="mt-6">
			<Button type="submit" size="lg" class="w-full rounded-xl">Save Brand Settings</Button>
		</div>
	</form>
</div>
