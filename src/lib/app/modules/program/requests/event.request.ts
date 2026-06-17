import { z } from 'zod';
import { OTHER_EVENT_TYPE_VALUE } from '../forms/event.form';

const nullableString = () =>
	z.preprocess(
		(value) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null),
		z.string().nullable().optional()
	);

const nullableDateString = () =>
	z.preprocess(
		(value) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null),
		z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
			.nullable()
			.optional()
	);

const nullableTimeString = () =>
	z.preprocess(
		(value) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null),
		z
			.string()
			.regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format jam harus HH:mm')
			.nullable()
			.optional()
	);

const eventShape = {
	slug: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Slug wajib diisi')
	),
	title: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Title wajib diisi')
	),
	description: z.preprocess(
		(value) => (typeof value === 'string' ? value.trim() : ''),
		z.string().min(1, 'Description wajib diisi')
	),
	eventType: nullableString(),
	eventTypeOther: nullableString(),
	imageUrl: nullableString(),
	location: nullableString(),
	priceAmount: z.preprocess(
		(value) => {
			if (value === '' || value === null || value === undefined) return null;
			const num = Number(value);
			return isNaN(num) ? null : num;
		},
		z.number().int().min(0).nullable().optional()
	),
	startAt: nullableDateString(),
	startTime: nullableTimeString(),
	endAt: nullableDateString(),
	endTime: nullableTimeString(),
	isActive: z.preprocess(
		(value) => value === 'true' || value === true,
		z.boolean().default(true)
	)
};

const eventTypeValidators: Record<
	string,
	(data: { eventTypeOther?: string | null }, ctx: z.RefinementCtx) => void
> = {
	[OTHER_EVENT_TYPE_VALUE]: (data, ctx) =>
		data.eventTypeOther ||
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ['eventTypeOther'],
			message: 'Tipe acara wajib diisi'
		})
};

function refineEventType(
	data: { eventType?: string | null; eventTypeOther?: string | null },
	ctx: z.RefinementCtx
) {
	eventTypeValidators[data.eventType ?? '']?.(data, ctx);
}

function normalizeEventType<T extends { eventType?: string | null; eventTypeOther?: string | null }>(
	data: T
) {
	const { eventTypeOther, ...rest } = data;
	return {
		...rest,
		eventType: data.eventType === OTHER_EVENT_TYPE_VALUE ? eventTypeOther : data.eventType
	};
}

export const CreateEventSchema = z
	.object(eventShape)
	.superRefine(refineEventType)
	.transform(normalizeEventType);

export const UpdateEventSchema = z
	.object({ ...eventShape, id: z.string() })
	.superRefine(refineEventType)
	.transform(normalizeEventType);

export type CreateEventDTO = z.infer<typeof CreateEventSchema>;
export type UpdateEventDTO = z.infer<typeof UpdateEventSchema>;
