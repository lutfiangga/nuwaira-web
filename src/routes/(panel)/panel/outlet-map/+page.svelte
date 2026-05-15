<script lang="ts">
	import { onMount } from 'svelte';
	import { MapPin, Navigation, ExternalLink, Search, Filter } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';

	let { data } = $props();

	let mapContainer: HTMLDivElement;
	let map = $state<any>(null);
	let markers: any[] = [];
	let outletCircles: any[] = [];

	let selectedOutlet = $state<any>(null);

	// Filters
	let searchQuery = $state('');
	let selectedCity = $state<string>('');
	let selectedProvince = $state<string>('');

	// Derived state for unique values
	let cities = $derived([...new Set(data.outlets.map((o: any) => o.city).filter(Boolean))].sort());
	let provinces = $derived(
		[...new Set(data.outlets.map((o: any) => o.province).filter(Boolean))].sort()
	);

	// Derived filtered outlets
	let filteredOutlets = $derived.by(() => {
		let outlets = [...data.outlets];

		// 1. Filter by Search Query
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			outlets = outlets.filter(
				(o: any) =>
					o.name?.toLowerCase().includes(q) ||
					o.address?.toLowerCase().includes(q) ||
					o.district?.toLowerCase().includes(q) ||
					o.province?.toLowerCase().includes(q)
			);
		}

		// 2. Filter by Province
		if (selectedProvince && selectedProvince !== 'all') {
			outlets = outlets.filter((o: any) => o.province === selectedProvince);
		}

		// 3. Filter by City
		if (selectedCity && selectedCity !== 'all') {
			outlets = outlets.filter((o: any) => o.city === selectedCity);
		}

		// Sort: Alphabetical
		outlets.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));

		return outlets;
	});

	// SVG Icons as strings for Leaflet DivIcon
	const storeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`;

	const userIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-white"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`;

	// Effect to update map markers when filtered list changes
	$effect(() => {
		if (!map) return;

		// Clear existing markers
		markers.forEach((m) => m.remove());
		markers = [];
		outletCircles.forEach((c) => c.remove());
		outletCircles = [];

		const L = (window as any).L;
		if (!L) return;

		// Custom Icons
		const createCustomIcon = (svg: string, bgColor: string) =>
			L.divIcon({
				className: 'custom-div-icon',
				html: `<div style="width: 40px; height: 40px; background-color: ${bgColor}; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); border: 2px solid white;">
				${svg}
			</div>`,
				iconSize: [40, 40],
				iconAnchor: [20, 20],
				popupAnchor: [0, -20]
			});

		const outletIcon = createCustomIcon(storeIconSvg, '#f97316'); // orange-500

		filteredOutlets.forEach((outlet: any) => {
			if (outlet.latitude && outlet.longitude) {
				const marker = L.marker([outlet.latitude, outlet.longitude], { icon: outletIcon })

					.addTo(map)
					.bindPopup(
						`<div class="p-2">
							<h3 class="font-bold text-lg">${outlet.name}</h3>
							<p class="text-sm text-gray-600">${outlet.address || 'No address'}</p>
							<p class="text-xs text-gray-500 mt-1">
								${[outlet.district, outlet.city, outlet.province].filter(Boolean).join(', ')}
							</p>
							<a 
								href="https://www.google.com/maps?q=${outlet.latitude},${outlet.longitude}" 
								target="_blank"
								class="text-blue-600 text-sm hover:underline mt-2 inline-block"
							>
								Open in Google Maps →
							</a>
						</div>`
					);

				marker.on('click', () => {
					selectedOutlet = outlet;
				});

				markers.push(marker);
			}
		});

		// Update radius circle
		// Removed userLocation dependent code
	});

	onMount(async () => {
		// Dynamically import Leaflet
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');

		// Fix default marker icon issue with Vite
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
			iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
			shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
		});

		// Initialize map with neutral options
		map = L.map(mapContainer, {
			zoomControl: true,
			attributionControl: false,
			background: 'transparent' // visual nice-to-have, valid in some versions or handled via css
		});

		// Fetch and add Indonesia GeoJSON
		try {
			const res = await fetch(
				'https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json'
			);
			const geoData = await res.json();

			const geoJsonLayer = L.geoJSON(geoData, {
				style: {
					color: '#64748b', // border color (slate-500)
					weight: 1,
					fillColor: '#cbd5e1', // fill color (slate-300)
					fillOpacity: 1
				},
				onEachFeature: (feature, layer) => {
					layer.on({
						mouseover: (e) => {
							const l = e.target;
							l.setStyle({
								weight: 2,
								color: '#475569',
								fillColor: '#94a3b8',
								fillOpacity: 1
							});
						},
						mouseout: (e) => {
							geoJsonLayer.resetStyle(e.target);
						}
					});
				}
			}).addTo(map);

			// Fit map to Indonesia bounds
			// map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
			map.setView([-2.5, 118], 5); // Fixed scale for Indonesia
		} catch (error) {
			console.error('Failed to load GeoJSON:', error);
			// Fallback: simple view if fetch fails
			const center: [number, number] =
				data.outlets.length > 0 && data.outlets[0].latitude && data.outlets[0].longitude
					? [data.outlets[0].latitude, data.outlets[0].longitude]
					: [-2.5, 118]; // Center of Indonesia
			map.setView(center, 5);
		}

	});

	// ... [keep helper functions]

	function focusOutlet(outlet: any) {
		if (map && outlet.latitude && outlet.longitude) {
			map.setView([outlet.latitude, outlet.longitude], 15);
			selectedOutlet = outlet;
		}
	}

</script>

<svelte:head>
	<title>Outlet Map</title>
</svelte:head>

<div class="flex flex-col h-[calc(100vh-4rem)] gap-4">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Outlet Map</h1>
			<p class="text-muted-foreground">Find outlets near you</p>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
		<!-- Sidebar -->
		<div class="lg:col-span-1 flex flex-col gap-4 overflow-y-auto max-h-full">
			<!-- Filters -->
			<Card.Card>
				<Card.CardContent class="p-4 space-y-4">
					<div class="space-y-2">
						<Label>Search</Label>
						<div class="relative">
							<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search by name, address..."
								class="pl-9"
								bind:value={searchQuery}
							/>
						</div>
					</div>

					<div class="space-y-2">
						<Label>Province Filter</Label>
						<Select.Root type="single" bind:value={selectedProvince}>
							<Select.Trigger class="w-full">
								{#if selectedProvince && selectedProvince !== 'all'}
									{selectedProvince}
								{:else}
									All Provinces
								{/if}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="all">All Provinces</Select.Item>
								{#each provinces as province}
									<Select.Item value={province} label={province}>{province}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="space-y-2">
						<Label>City Filter</Label>
						<Select.Root type="single" bind:value={selectedCity}>
							<Select.Trigger class="w-full">
								{#if selectedCity && selectedCity !== 'all'}
									{selectedCity}
								{:else}
									All Cities
								{/if}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="all">All Cities</Select.Item>
								{#each cities as city}
									<Select.Item value={city} label={city}>{city}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<!-- Radius Control Removed -->
				</Card.CardContent>
			</Card.Card>

			<!-- Outlet List -->
			<div class="space-y-2">
				<div class="flex items-center justify-between px-1">
					<h3 class="font-semibold">
						Outlets ({filteredOutlets.length})
					</h3>
				</div>

				{#if filteredOutlets.length === 0}
					<Card.Card>
						<Card.CardContent class="p-8 text-center text-muted-foreground">
							<MapPin class="h-10 w-10 mx-auto mb-2 opacity-50" />
							<p>No outlets found matching your criteria.</p>
						</Card.CardContent>
					</Card.Card>
				{:else}
					{#each filteredOutlets as outlet}
						<Card.Card
							class="cursor-pointer hover:bg-accent transition-colors {selectedOutlet?.id ===
							outlet.id
								? 'border-primary bg-accent/50'
								: ''}"
							onclick={() => focusOutlet(outlet)}
						>
							<Card.CardContent class="p-4">
								<div class="flex items-start gap-3">
									<MapPin class="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
									<div class="flex-1 min-w-0">
										<h4 class="font-medium truncate">{outlet.name}</h4>
										<p class="text-sm text-muted-foreground truncate">
											{outlet.address || 'No address'}
										</p>
										<p class="text-xs text-muted-foreground mt-1">
											{[outlet.district, outlet.city].filter(Boolean).join(', ')}
										</p>
									</div>
								</div>
							</Card.CardContent>
						</Card.Card>
					{/each}
				{/if}
			</div>

			<!-- Selected Outlet Detail -->
			{#if selectedOutlet}
				<Card.Card class="border-primary mt-4">
					<Card.CardHeader>
						<Card.CardTitle class="flex items-center gap-2">
							<MapPin class="h-5 w-5" />
							{selectedOutlet.name}
						</Card.CardTitle>
					</Card.CardHeader>
					<Card.CardContent class="space-y-3">
						<div>
							<p class="text-sm font-medium">Address</p>
							<p class="text-sm text-muted-foreground">
								{selectedOutlet.address || 'No address'}
							</p>
						</div>
						<div>
							<p class="text-sm font-medium">Location</p>
							<p class="text-sm text-muted-foreground">
								{[selectedOutlet.district, selectedOutlet.city, selectedOutlet.province]
									.filter(Boolean)
									.join(', ')}
							</p>
						</div>
						<div>
							<p class="text-sm font-medium">Coordinates</p>
							<p class="text-sm text-muted-foreground font-mono">
								{selectedOutlet.latitude}, {selectedOutlet.longitude}
							</p>
						</div>
						<a
							href={`https://www.google.com/maps?q=${selectedOutlet.latitude},${selectedOutlet.longitude}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button class="w-full" variant="outline">
								<ExternalLink class="mr-2 h-4 w-4" />
								Open in Google Maps
							</Button>
						</a>
					</Card.CardContent>
				</Card.Card>
			{/if}
		</div>

		<!-- Map -->
		<div class="lg:col-span-2 mb-8">
			<div bind:this={mapContainer} class="w-full h-full min-h-[500px]"></div>
		</div>
	</div>
</div>

<style>
	:global(.leaflet-popup-content-wrapper) {
		border-radius: 8px;
	}
	:global(.leaflet-popup-content) {
		margin: 0;
	}
	:global(.leaflet-container) {
		background: transparent !important;
	}
</style>
