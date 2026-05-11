<script lang="ts">
	import { onMount } from 'svelte';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';

	let { province = $bindable(''), city = $bindable(''), district = $bindable('') } = $props();

	let provinces: any[] = $state([]);
	let cities: any[] = $state([]);
	let districts: any[] = $state([]);

	let selectedProvince = $state<any>(null);
	let selectedCity = $state<any>(null);
	let selectedDistrict = $state<any>(null);

	// Fetch provinces on mount
	onMount(async () => {
		try {
			const res = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
			provinces = await res.json();
		} catch (e) {
			console.error('Failed to load provinces:', e);
		}
	});

	// Fetch cities when province changes
	async function handleProvinceChange(value: string) {
		const prov = provinces.find((p) => p.name === value);
		if (prov) {
			selectedProvince = prov;
			province = prov.name;
			city = '';
			district = '';
			selectedCity = null;
			selectedDistrict = null;
			districts = [];

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

	// Fetch districts when city changes
	async function handleCityChange(value: string) {
		const cty = cities.find((c) => c.name === value);
		if (cty) {
			selectedCity = cty;
			city = cty.name;
			district = '';
			selectedDistrict = null;

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

	function handleDistrictChange(value: string) {
		const dist = districts.find((d) => d.name === value);
		if (dist) {
			selectedDistrict = dist;
			district = dist.name;
		}
	}
</script>

<div class="grid grid-cols-3 gap-4">
	<div class="space-y-2">
		<Label for="province">Province</Label>
		<Select.Root onSelectedChange={(v) => v?.value && handleProvinceChange(v.value)}>
			<Select.Trigger id="province" class="w-full">
				<Select.Value placeholder="Select province" />
			</Select.Trigger>
			<Select.Content>
				{#each provinces as prov}
					<Select.Item value={prov.name}>{prov.name}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<input type="hidden" name="province" value={province} />
	</div>

	<div class="space-y-2">
		<Label for="city">City</Label>
		<Select.Root
			disabled={!selectedProvince}
			onSelectedChange={(v) => v?.value && handleCityChange(v.value)}
		>
			<Select.Trigger id="city" class="w-full">
				<Select.Value placeholder="Select city" />
			</Select.Trigger>
			<Select.Content>
				{#each cities as cty}
					<Select.Item value={cty.name}>{cty.name}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<input type="hidden" name="city" value={city} />
	</div>

	<div class="space-y-2">
		<Label for="district">District</Label>
		<Select.Root
			disabled={!selectedCity}
			onSelectedChange={(v) => v?.value && handleDistrictChange(v.value)}
		>
			<Select.Trigger id="district" class="w-full">
				<Select.Value placeholder="Select district" />
			</Select.Trigger>
			<Select.Content>
				{#each districts as dist}
					<Select.Item value={dist.name}>{dist.name}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<input type="hidden" name="district" value={district} />
	</div>
</div>
