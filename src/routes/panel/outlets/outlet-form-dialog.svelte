<script lang="ts">
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Combobox } from '$lib/components/ui/combobox';

	let {
		open = $bindable(false),
		mode = 'create',
		data = null,
		action = ''
	}: {
		open: boolean;
		mode: 'create' | 'edit';
		data?: any;
		action: string;
	} = $props();

	let formElement: HTMLFormElement;
	let loading = $state(false);

	// Form fields
	let name = $state('');
	let address = $state('');
	let province = $state('');
	let city = $state('');
	let district = $state('');
	let latitude = $state('');
	let longitude = $state('');

	// Location data
	let provinces: any[] = $state([]);
	let cities: any[] = $state([]);
	let districts: any[] = $state([]);

	// Computed items for combobox
	let provinceItems = $derived(provinces.map((p) => ({ value: p.name, label: p.name })));
	let cityItems = $derived(cities.map((c) => ({ value: c.name, label: c.name })));
	let districtItems = $derived(districts.map((d) => ({ value: d.name, label: d.name })));

	// Load provinces on mount
	onMount(async () => {
		try {
			const res = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
			provinces = await res.json();
		} catch (e) {
			console.error('Failed to load provinces:', e);
		}
	});

	// Watch for data changes (edit mode)
	$effect(() => {
		if (data && mode === 'edit') {
			name = data.name || '';
			address = data.address || '';
			province = data.province || '';
			city = data.city || '';
			district = data.district || '';
			latitude = data.latitude?.toString() || '';
			longitude = data.longitude?.toString() || '';
		} else if (mode === 'create') {
			resetForm();
		}
	});

	function resetForm() {
		name = '';
		address = '';
		province = '';
		city = '';
		district = '';
		latitude = '';
		longitude = '';
		cities = [];
		districts = [];
	}

	async function handleProvinceSelect(selectedProvince: string) {
		province = selectedProvince;
		city = '';
		district = '';
		cities = [];
		districts = [];

		const prov = provinces.find((p) => p.name === selectedProvince);
		if (prov) {
			try {
				const res = await fetch(
					`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov.id}.json`
				);
				cities = await res.json();
			} catch (e) {
				console.error('Failed to load cities:', e);
			}
		}
	}

	async function handleCitySelect(selectedCity: string) {
		city = selectedCity;
		district = '';
		districts = [];

		const cty = cities.find((c) => c.name === selectedCity);
		if (cty) {
			try {
				const res = await fetch(
					`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cty.id}.json`
				);
				districts = await res.json();
			} catch (e) {
				console.error('Failed to load districts:', e);
			}
		}
	}

	function handleDistrictSelect(selectedDistrict: string) {
		district = selectedDistrict;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;

		try {
			const formData = new FormData(formElement);
			const response = await fetch(action, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				open = false;
				resetForm();
				window.location.reload();
			}
		} catch (error) {
			console.error('Form submission error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>{mode === 'create' ? 'Create Outlet' : 'Edit Outlet'}</Dialog.Title>
		</Dialog.Header>

		<form bind:this={formElement} onsubmit={handleSubmit} class="space-y-6">
			{#if mode === 'edit' && data}
				<input type="hidden" name="id" value={data.id} />
			{/if}

			<!-- Basic Info -->
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="name">Outlet Name *</Label>
					<Input id="name" name="name" bind:value={name} required />
				</div>
				<div class="space-y-2">
					<Label for="address">Address</Label>
					<Textarea id="address" name="address" bind:value={address} />
				</div>
			</div>

			<!-- Location -->
			<div class="space-y-4">
				<h3 class="text-sm font-medium">Location</h3>
				<div class="grid grid-cols-3 gap-4">
					<!-- Province Combobox -->
					<div class="space-y-2">
						<Label>Province</Label>
						<Combobox
							items={provinceItems}
							placeholder="Select province..."
							bind:value={province}
							onSelect={handleProvinceSelect}
						/>
						<input type="hidden" name="province" value={province} />
					</div>

					<!-- City Combobox -->
					<div class="space-y-2">
						<Label>City</Label>
						<Combobox
							items={cityItems}
							placeholder="Select city..."
							bind:value={city}
							disabled={!province}
							onSelect={handleCitySelect}
						/>
						<input type="hidden" name="city" value={city} />
					</div>

					<!-- District Combobox -->
					<div class="space-y-2">
						<Label>District</Label>
						<Combobox
							items={districtItems}
							placeholder="Select district..."
							bind:value={district}
							disabled={!city}
							onSelect={handleDistrictSelect}
						/>
						<input type="hidden" name="district" value={district} />
					</div>
				</div>
			</div>

			<!-- Coordinates -->
			<div class="space-y-4">
				<h3 class="text-sm font-medium">Coordinates (Optional)</h3>
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="latitude">Latitude</Label>
						<Input id="latitude" name="latitude" type="number" step="any" bind:value={latitude} />
					</div>
					<div class="space-y-2">
						<Label for="longitude">Longitude</Label>
						<Input
							id="longitude"
							name="longitude"
							type="number"
							step="any"
							bind:value={longitude}
						/>
					</div>
				</div>
			</div>

			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit" disabled={loading}>
					{loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
