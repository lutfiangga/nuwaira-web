import AiIcon from './components/icons/aiIcon.svelte';
import PlanIcon from './components/icons/planIcon.svelte';
import TeachingIcon from './components/icons/teachingIcon.svelte';
import { Handshake, HeartHandshake, PanelsTopLeft } from '@lucide/svelte';
import type { Component } from 'svelte';

export const NAV_MENU = [
	{ title: 'Home', url: '/', type: 'link' },
	{ title: 'Tentang Kami', url: '/#tentang-kami', type: 'link' },
	{ title: 'Program', url: '/programs', type: 'programs' },
	{ title: 'Acara', url: '/#acara', type: 'events' }
] as const;

export const BENEFITS = [
	{
		icon: TeachingIcon,
		title: 'Belajar Langsung',
		description:
			'Interaksi langsung dengan mentor profesional untuk diskusi yang lebih mendalam dan intensif.'
	},
	{
		icon: AiIcon,
		title: 'Ai Integrated',
		description:
			'Kurikulum yang selalu adaptif terhadap perkembangan AI terkini dalam setiap workflow coding.'
	},
	{
		icon: PlanIcon,
		title: 'Project Based',
		description:
			'Belajar melalui pengerjaan proyek nyata yang mempersiapkan Anda untuk tantangan industri.'
	}
] as const;

export const AUDIENCE_BENEFITS: {
	icon: Component<{ class?: string }>;
	title: string;
	description: string;
}[] = [
	{
		icon: Handshake,
		title: '1-on-1 Mentoring',
		description: 'Dibimbing mentor aktif yang mengerjakan proyek industri nyata.'
	},
	{
		icon: HeartHandshake,
		title: 'Self Development',
		description: 'Dibekali komunikasi, problem solving, dan pola pikir profesional.'
	},
	{
		icon: PanelsTopLeft,
		title: 'Project-Based Learning',
		description: 'Setiap materi menghasilkan output nyata yang dibangun bertahap.'
	}
];

export const FACILITIES = [
	{
		label: 'Ruang Diskusi',
		src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
		alt: 'Ruang diskusi modern'
	},
	{
		label: 'Musholla',
		src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85',
		alt: 'Area interior gedung belajar'
	},
	{
		label: 'Taman',
		src: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85',
		alt: 'Taman hijau'
	},
	{
		label: 'Ruang Kelas',
		src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=85',
		alt: 'Ruang kelas'
	},
	{
		label: 'Gazebo',
		src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=85',
		alt: 'Gazebo terbuka'
	}
] as const;
