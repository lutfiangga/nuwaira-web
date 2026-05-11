<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Search, MapPin, Loader2 } from '@lucide/svelte';

	let {
		latitude = $bindable(),
		longitude = $bindable()
	}: {
		latitude?: string;
		longitude?: string;
	} = $props();

	// Local state to handle undefined values
	let localLatitude = $state(latitude || '');
	let localLongitude = $state(longitude || '');

	// Sync local values with props
	$effect(() => {
		localLatitude = latitude || '';
		localLongitude = longitude || '';
	});

	// Sync props with local values
	$effect(() => {
		latitude = localLatitude;
		longitude = localLongitude;
	});

	let searchQuery = $state('');
	let searching = $state(false);
	let error = $state('');
	let suggestions = $state<any[]>([]);
	let showSuggestions = $state(false);
	let debounceTimer: any = null;

	// Debounced search for suggestions
	$effect(() => {
		if (searchQuery.length >= 3) {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				fetchSuggestions();
			}, 500);
		} else {
			suggestions = [];
			showSuggestions = false;
		}
	});

	async function fetchSuggestions() {
		if (!searchQuery.trim() || searchQuery.length < 3) return;

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&addressdetails=1`
			);

			if (response.ok) {
				const data = await response.json();
				suggestions = data;
				showSuggestions = data.length > 0;
			}
		} catch (e) {
			console.error('Failed to fetch suggestions:', e);
		}
	}

	function selectSuggestion(suggestion: any) {
		localLatitude = suggestion.lat;
		localLongitude = suggestion.lon;
		searchQuery = suggestion.display_name;
		showSuggestions = false;
		error = '';
	}

	async function searchLocation() {
		if (!searchQuery.trim()) {
			error = 'Please enter a location to search';
			return;
		}

		searching = true;
		error = '';
		showSuggestions = false;

		try {
			// Using Nominatim (OpenStreetMap) - free geocoding service
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
			);

			if (!response.ok) {
				throw new Error('Failed to fetch location');
			}

			const data = await response.json();

			if (data && data.length > 0) {
				const location = data[0];
				localLatitude = location.lat;
				localLongitude = location.lon;
				error = '';
			} else {
				error = 'Location not found. Try a more specific address.';
			}
		} catch (e) {
			console.error('Geocoding error:', e);
			error = 'Failed to search location. Please try again.';
		} finally {
			searching = false;
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			searchLocation();
		} else if (e.key === 'Escape') {
			showSuggestions = false;
		}
	}

	function handleBlur() {
		// Delay to allow click on suggestion
		setTimeout(() => {
			showSuggestions = false;
		}, 200);
	}
</script>

<div class="space-y-4">
	<!-- Search Location -->
	<div class="space-y-2">
		<Label for="location-search">Search Location</Label>
		<div class="relative">
			<div class="flex gap-2">
				<div class="relative flex-1">
					<Input
						id="location-search"
						bind:value={searchQuery}
						placeholder="e.g. Jl. Sudirman, Jakarta or Monas, Jakarta"
						onkeypress={handleKeyPress}
						onblur={handleBlur}
						onfocus={() => {
							if (suggestions.length > 0) showSuggestions = true;
						}}
					/>
					{#if showSuggestions && suggestions.length > 0}
						<div
							class="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md"
							role="listbox"
						>
							{#each suggestions as suggestion, i}
								<button
									type="button"
									class="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border-b last:border-b-0"
									onclick={() => selectSuggestion(suggestion)}
									role="option"
									aria-selected="false"
								>
									<div class="flex items-start gap-2">
										<MapPin class="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
										<div class="flex-1 min-w-0">
											<p class="font-medium truncate">{suggestion.display_name}</p>
											{#if suggestion.address}
												<p class="text-xs text-muted-foreground truncate">
													{[
														suggestion.address.city ||
															suggestion.address.town ||
															suggestion.address.village,
														suggestion.address.state,
														suggestion.address.country
													]
														.filter(Boolean)
														.join(', ')}
												</p>
											{/if}
										</div>
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<Button type="button" onclick={searchLocation} disabled={searching} variant="outline">
					{#if searching}
						<Loader2 class="h-4 w-4 animate-spin" />
					{:else}
						<Search class="h-4 w-4" />
					{/if}
				</Button>
			</div>
		</div>
		{#if error}
			<p class="text-sm text-destructive">{error}</p>
		{/if}
		<p class="text-xs text-muted-foreground">
			<MapPin class="inline h-3 w-3" />
			Type at least 3 characters to see suggestions
		</p>
	</div>

	<!-- Manual Coordinates -->
	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-2">
			<Label for="latitude">Latitude</Label>
			<Input
				id="latitude"
				name="latitude"
				type="text"
				bind:value={localLatitude}
				placeholder="-6.175"
			/>
		</div>
		<div class="space-y-2">
			<Label for="longitude">Longitude</Label>
			<Input
				id="longitude"
				name="longitude"
				type="text"
				bind:value={localLongitude}
				placeholder="106.827"
			/>
		</div>
	</div>

	{#if localLatitude && localLongitude}
		<div class="rounded-md bg-muted p-3 text-sm">
			<p class="font-medium">Current Coordinates:</p>
			<p class="text-muted-foreground">
				{localLatitude}, {localLongitude}
				<a
					href={`https://www.google.com/maps?q=${localLatitude},${localLongitude}`}
					target="_blank"
					rel="noopener noreferrer"
					class="ml-2 text-primary hover:underline"
				>
					View on Google Maps →
				</a>
			</p>
		</div>
	{/if}
</div>
