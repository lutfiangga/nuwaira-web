export type ProgramMetricIcon = string;
export type ProgramJourneyIcon = 'foundation' | 'logic' | 'professional' | 'capstone';

export interface PublicProgramSummary {
	slug: string;
	title: string;
	summary: string;
	eyebrow: string;
}

export interface ProgramPageData extends PublicProgramSummary {
	seoTitle: string;
	seoDescription: string;
	heroImage: string;
	heroImageAlt: string;
	metrics: { label: string; value: string; icon: ProgramMetricIcon }[];
	intro: {
		eyebrow: string;
		title: string;
		image: string;
		imageAlt: string;
		deskripsi: string[];
		learningBackground: string[];
	};
	journey: {
		title: string;
		subtitle: string;
		stages: {
			id: string;
			title: string;
			weeks: string;
			description: string;
			output: string;
			icon: ProgramJourneyIcon;
			tools: { name: string; iconKey: string }[];
		}[];
	};
	pricing: {
		title: string;
		subtitle: string;
		plans: {
			id: string;
			name: string;
			badge: string;
			title: string;
			price: string;
			schedule: string[];
			benefits: string[];
			ctaLabel: string;
			ctaUrl: string;
			type: 'batch' | 'private';
			scheduleInfo: {
				days: string[];
				time: string | null;
				startPeriod: string | null;
				endPeriod: string | null;
				locationType: 'remote' | 'onsite' | null;
				location: string | null;
			} | null;
		}[];
	};
}
