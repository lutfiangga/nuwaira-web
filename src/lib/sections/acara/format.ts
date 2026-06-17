type DateLike = Date | string | null | undefined;

function parseDate(value: DateLike) {
	const date = value ? new Date(value) : null;
	const validDate = date && !Number.isNaN(date.getTime());
	return validDate ? date : null;
}

function isSameDay(left: Date, right: Date) {
	return (
		left.getFullYear() === right.getFullYear() &&
		left.getMonth() === right.getMonth() &&
		left.getDate() === right.getDate()
	);
}

function isSameMonth(left: Date, right: Date) {
	return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function isSameYear(left: Date, right: Date) {
	return left.getFullYear() === right.getFullYear();
}

function formatFullDate(date: Date) {
	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(date);
}

function formatDayMonth(date: Date) {
	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'long'
	}).format(date);
}

function formatMonthYear(date: Date) {
	return new Intl.DateTimeFormat('id-ID', {
		month: 'long',
		year: 'numeric'
	}).format(date);
}

function formatTime(date: Date) {
	return new Intl.DateTimeFormat('id-ID', {
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}

export function formatEventDateRange(start: DateLike, end: DateLike) {
	const startDate = parseDate(start);
	const endDate = parseDate(end);
	const ranges = [
		{
			matches: Boolean(startDate && (!endDate || isSameDay(startDate, endDate))),
			value: startDate ? formatFullDate(startDate) : null
		},
		{
			matches: Boolean(startDate && endDate && isSameMonth(startDate, endDate)),
			value:
				startDate && endDate
					? `${startDate.getDate()}-${endDate.getDate()} ${formatMonthYear(startDate)}`
					: null
		},
		{
			matches: Boolean(startDate && endDate && isSameYear(startDate, endDate)),
			value: startDate && endDate ? `${formatDayMonth(startDate)} - ${formatFullDate(endDate)}` : null
		},
		{
			matches: Boolean(startDate && endDate),
			value: startDate && endDate ? `${formatFullDate(startDate)} - ${formatFullDate(endDate)}` : null
		}
	];

	return ranges.find((range) => range.matches)?.value ?? null;
}

export function formatEventTimeRange(start: DateLike, end: DateLike) {
	const startDate = parseDate(start);
	const endDate = parseDate(end);
	const ranges = [
		{
			matches: Boolean(startDate && (!endDate || formatTime(startDate) === formatTime(endDate))),
			value: startDate ? formatTime(startDate) : null
		},
		{
			matches: Boolean(startDate && endDate),
			value: startDate && endDate ? `${formatTime(startDate)} - ${formatTime(endDate)}` : null
		}
	];

	return ranges.find((range) => range.matches)?.value ?? null;
}

export function formatShortDate(d: Date | string | null | undefined) {
	const date = parseDate(d);
	return date
		? date.toLocaleString('id-ID', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		: null;
}

export function formatLongDate(d: Date | string | null | undefined) {
	const date = parseDate(d);
	return date
		? date.toLocaleString('id-ID', {
				weekday: 'long',
				day: 'numeric',
				month: 'long',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		: null;
}

export function formatPrice(amount: number | null) {
	return amount === null || amount === 0
		? 'Full Beasiswa'
		: new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
				maximumFractionDigits: 0
			}).format(amount);
}
