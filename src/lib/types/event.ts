export interface PublicEventSummary {
	id: string;
	slug: string;
	title: string;
	description: string | null;
	eventType: string | null;
	imageUrl: string | null;
	location: string | null;
	priceAmount: number | null;
	startAt: Date | null;
	endAt: Date | null;
}

export type PublicEventDetail = PublicEventSummary;
