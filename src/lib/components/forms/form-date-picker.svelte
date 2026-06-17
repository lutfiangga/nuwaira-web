<script lang="ts">
	import { CalendarDays, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let {
		name,
		label,
		value = $bindable(),
		placeholder = 'Pilih tanggal',
		description,
		error,
		required = false,
		disabled = false,
		min,
		max
	}: {
		name: string;
		label: string;
		value?: string | Date | null;
		placeholder?: string;
		description?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		min?: string;
		max?: string;
	} = $props();

	const monthNames = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];
	const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

	let open = $state(false);
	let viewMonth = $state(new Date().getMonth());
	let viewYear = $state(new Date().getFullYear());
	let initializedValue = $state('');

	const minDate = $derived(parseIsoDate(min));
	const maxDate = $derived(parseIsoDate(max));
	const selectedDate = $derived(parseIsoDate(value));
	const normalizedValue = $derived(toInputDate(value));
	const displayValue = $derived(
		selectedDate
			? new Intl.DateTimeFormat('id-ID', {
					day: '2-digit',
					month: 'long',
					year: 'numeric'
				}).format(selectedDate)
			: ''
	);
	const years = $derived.by(() => {
		const currentYear = new Date().getFullYear();
		const first = minDate?.getFullYear() ?? currentYear - 80;
		const last = maxDate?.getFullYear() ?? currentYear + 10;
		return Array.from({ length: last - first + 1 }, (_, index) => last - index);
	});
	const calendarDays = $derived.by(() => buildCalendar(viewYear, viewMonth));

	$effect(() => {
		if (!value || value === initializedValue) return;

		const parsed = parseIsoDate(value);
		if (!parsed) return;

		initializedValue = value;
		viewMonth = parsed.getMonth();
		viewYear = parsed.getFullYear();
	});

	function buildCalendar(year: number, month: number) {
		const firstDay = new Date(year, month, 1);
		return Array.from(
			{ length: 42 },
			(_, index) => new Date(year, month, 1 - firstDay.getDay() + index)
		);
	}

	function parseIsoDate(dateValue?: string | Date | null) {
		const inputValue =
			dateValue instanceof Date
				? toIsoDate(dateValue)
				: typeof dateValue === 'string'
					? dateValue.slice(0, 10)
					: '';
		const validInput = /^\d{4}-\d{2}-\d{2}$/.test(inputValue);
		const [year, month, day] = validInput ? inputValue.split('-').map(Number) : [];
		const date = validInput ? new Date(year, month - 1, day) : null;
		return date && !Number.isNaN(date.getTime()) ? date : null;
	}

	function toIsoDate(date: Date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function toInputDate(dateValue?: string | Date | null) {
		const parsed = parseIsoDate(dateValue);
		return parsed ? toIsoDate(parsed) : '';
	}

	function isDisabledDate(date: Date) {
		const time = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
		return Boolean((minDate && time < minDate.getTime()) || (maxDate && time > maxDate.getTime()));
	}

	function isSameDate(left: Date | null, right: Date) {
		return Boolean(
			left &&
			left.getFullYear() === right.getFullYear() &&
			left.getMonth() === right.getMonth() &&
			left.getDate() === right.getDate()
		);
	}

	function selectDate(date: Date) {
		if (isDisabledDate(date)) return;
		value = toIsoDate(date);
		open = false;
	}

	function changeMonth(offset: number) {
		const next = new Date(viewYear, viewMonth + offset, 1);
		viewMonth = next.getMonth();
		viewYear = next.getFullYear();
	}
</script>

<div class="grid gap-2">
	<p class="text-sm font-semibold text-slate-700">
		{label}
		{#if required}<span class="text-red-500">*</span>{/if}
	</p>

	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					type="button"
					variant="outline"
					class={cn(
						'h-12 w-full justify-between rounded-xl border-slate-200 bg-white px-4 font-normal shadow-none hover:bg-slate-50',
						!displayValue && 'text-slate-400',
						error && 'border-red-400 ring-2 ring-red-100'
					)}
					{disabled}
					aria-invalid={Boolean(error)}
					aria-label={label}
				>
					<span>{displayValue || placeholder}</span>
					<CalendarDays class="size-5 text-slate-400" />
				</Button>
			{/snippet}
		</Popover.Trigger>

		<Popover.Content
			align="start"
			class="w-[min(360px,calc(100vw-2rem))] rounded-2xl border-slate-200 p-4 shadow-2xl"
		>
			<div class="mb-4 flex items-center justify-between gap-2">
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					aria-label="Bulan sebelumnya"
					onclick={() => changeMonth(-1)}
				>
					<ChevronLeft class="size-4" />
				</Button>

				<div class="flex flex-1 gap-2">
					<select
						aria-label="Pilih bulan"
						class="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold outline-none focus:border-brand"
						bind:value={viewMonth}
					>
						{#each monthNames as month, index (month)}
							<option value={index}>{month}</option>
						{/each}
					</select>
					<select
						aria-label="Pilih tahun"
						class="h-9 w-24 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold outline-none focus:border-brand"
						bind:value={viewYear}
					>
						{#each years as year (year)}
							<option value={year}>{year}</option>
						{/each}
					</select>
				</div>

				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					aria-label="Bulan berikutnya"
					onclick={() => changeMonth(1)}
				>
					<ChevronRight class="size-4" />
				</Button>
			</div>

			<div class="grid grid-cols-7 gap-1 text-center">
				{#each weekdays as weekday (weekday)}
					<div class="py-1 text-[11px] font-semibold uppercase text-slate-400">{weekday}</div>
				{/each}

				{#each calendarDays as date (date.toISOString())}
					{@const outsideMonth = date.getMonth() !== viewMonth}
					{@const selected = isSameDate(selectedDate, date)}
					{@const today = isSameDate(new Date(), date)}
					{@const dateDisabled = isDisabledDate(date)}
					<button
						type="button"
						disabled={dateDisabled}
						onclick={() => selectDate(date)}
						class={cn(
							'flex aspect-square items-center justify-center rounded-lg text-sm transition',
							outsideMonth && 'text-slate-300',
							!outsideMonth && !selected && 'text-slate-700 hover:bg-blue-50 hover:text-brand',
							today && !selected && 'ring-1 ring-brand/40',
							selected && 'bg-brand font-semibold text-white shadow-md',
							dateDisabled && 'cursor-not-allowed opacity-25'
						)}
					>
						{date.getDate()}
					</button>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>

	<input type="hidden" {name} value={normalizedValue} {required} />

	{#if error}
		<p class="text-sm text-red-600">{error}</p>
	{:else if description}
		<p class="text-xs leading-5 text-slate-500">{description}</p>
	{/if}
</div>
