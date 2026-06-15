export const PROGRAM_SEED_DATA = [
	{
		slug: 'web-development-fundamental-with-ai',
		title: 'Web Development Fundamental with AI',
		summary:
			'Dari yang belum tahu HTML sampai bisa deploy website sendiri dengan workflow developer modern.',
		eyebrow: 'Program Fundamental',
		heroImage:
			'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=90',
		heroImageAlt: 'Mentor mengajar peserta dalam kelas web development',
		intro: {
			eyebrow: 'Tentang Program',
			title: 'Kamu Harus Mulai Bersama Nuwaira',
			image:
				'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1100&q=90',
			imageAlt: 'Peserta Nuwaira berdiskusi setelah kelas',
			paragraphs: [
				'Program ini dirancang untuk pemula yang membutuhkan arah belajar, mentor, dan lingkungan yang konsisten.',
				'Setiap materi berujung pada proyek nyata yang dikerjakan dan ditinjau bersama mentor.'
			],
			checklist: [
				'Belum pernah menulis kode',
				'Pernah belajar sendiri tetapi mandek',
				'Ingin beralih karier ke teknologi',
				'Ingin memiliki portofolio'
			]
		},
		metrics: [
			{ label: '40 Pertemuan', value: '20 Minggu', icon: 'Clock3' },
			{ label: 'Kelas Offline', value: 'Yogyakarta', icon: 'MapPinned' },
			{ label: 'Tanpa Background IT', value: 'Pemula', icon: 'UserRoundCheck' }
		],
		milestones: [
			{
				title: 'Fondasi',
				weeks: 'Minggu 1-4',
				description:
					'Dasar web modern, struktur halaman, styling responsif, dan workflow developer.',
				output: 'Landing page responsif.',
				icon: 'foundation',
				technologies: ['visual-studio-code', 'html5', 'css', 'figma', 'openai']
			},
			{
				title: 'Logika',
				weeks: 'Minggu 5-8',
				description: 'Logika pemrograman, DOM, data, dan interaksi pengguna.',
				output: 'Aplikasi web interaktif.',
				icon: 'logic',
				technologies: ['javascript', 'git', 'github']
			},
			{
				title: 'Profesional',
				weeks: 'Minggu 9-14',
				description: 'Komponen dan workflow aplikasi modern.',
				output: 'Aplikasi siap studi kasus.',
				icon: 'professional',
				technologies: ['react', 'svelte', 'tailwind-css']
			},
			{
				title: 'Capstone',
				weeks: 'Minggu 15-20',
				description: 'Proyek akhir dari ide sampai deployment.',
				output: 'Capstone project live.',
				icon: 'capstone',
				technologies: ['vercel', 'google-analytics', 'openai']
			}
		],
		offerings: [
			{
				slug: 'regular',
				type: 'batch',
				name: 'Kelas Reguler',
				title: 'Web Development Fundamental with AI',
				badge: 'Batch',
				priceAmount: 7500000,
				benefits: ['Kelas offline kelompok kecil', '40 sesi belajar', 'Mentoring rutin'],
				batches: [
					{
						slug: 'batch-009',
						title: 'Batch #009',
						startDate: '2026-07-01',
						endDate: '2026-11-30',
						isOpen: true,
						registrationOpenAt: null,
						registrationCloseAt: null,
						capacity: null,
						locationType: 'onsite',
						location: null,
						days: [],
						startTime: null,
						endTime: null
					}
				]
			},
			{
				slug: 'private',
				type: 'private',
				name: 'Kelas Private',
				title: 'Web Development Fundamental with AI - Private',
				badge: 'Private',
				priceAmount: 9500000,
				benefits: ['Materi dapat disesuaikan', 'Akses penuh ke mentor', 'Jadwal personal'],
				schedules: ['Jadwal fleksibel', 'Mulai sesuai kesepakatan']
			}
		]
	},
	{
		slug: 'ai-driven-full-stack-engineering',
		title: 'AI-Driven Full-Stack Engineering',
		summary:
			'Bangun frontend, backend, database, deployment, dan integrasi AI sebagai satu produk.',
		eyebrow: 'Program Intermediate',
		heroImage:
			'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=90',
		heroImageAlt: 'Tim developer mengembangkan aplikasi full-stack',
		intro: {
			eyebrow: 'Tentang Program',
			title: 'Dari Coder Menjadi Product Builder',
			image:
				'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1100&q=90',
			imageAlt: 'Tim membangun produk digital',
			paragraphs: ['Pelajari seluruh lapisan aplikasi melalui proyek yang utuh.'],
			checklist: ['Memahami dasar JavaScript', 'Ingin menguasai frontend dan backend']
		},
		metrics: [
			{ label: '48 Pertemuan', value: '24 Minggu', icon: 'Clock3' },
			{ label: 'Kelas Hybrid', value: 'Yogyakarta', icon: 'MapPinned' },
			{ label: 'Level', value: 'Intermediate', icon: 'UserRoundCheck' }
		],
		milestones: [
			{
				title: 'Frontend',
				weeks: 'Minggu 1-6',
				description: 'Component architecture, state, form, dan aksesibilitas.',
				output: 'Frontend dengan alur pengguna lengkap.',
				icon: 'foundation',
				technologies: ['typescript', 'svelte', 'tailwind-css', 'figma']
			},
			{
				title: 'Backend',
				weeks: 'Minggu 7-12',
				description: 'API, autentikasi, validasi, dan database relasional.',
				output: 'Backend aman dengan data persisten.',
				icon: 'logic',
				technologies: ['nodedotjs', 'postgresql', 'drizzle-orm']
			},
			{
				title: 'AI Integration',
				weeks: 'Minggu 13-18',
				description: 'Integrasi model AI, retrieval, dan evaluasi.',
				output: 'Fitur AI yang terukur.',
				icon: 'professional',
				technologies: ['openai', 'pinecone']
			},
			{
				title: 'Launch',
				weeks: 'Minggu 19-24',
				description: 'Testing, deployment, dan observability.',
				output: 'Produk full-stack live.',
				icon: 'capstone',
				technologies: ['playwright', 'docker', 'vercel']
			}
		],
		offerings: [
			{
				slug: 'kelas-reguler',
				type: 'batch',
				name: 'Kelas Reguler',
				title: 'AI-Driven Full-Stack Engineering',
				badge: 'Batch',
				priceAmount: 11500000,
				benefits: ['48 sesi belajar', 'Code review mingguan', 'Capstone full-stack'],
				batches: [
					{
						slug: 'batch-004',
						title: 'Batch #004',
						startDate: '2026-08-01',
						endDate: '2027-01-31',
						isOpen: true,
						registrationOpenAt: null,
						registrationCloseAt: null,
						capacity: null,
						locationType: 'onsite',
						location: 'Yogyakarta',
						days: [1, 2],
						startTime: '17:02',
						endTime: '19:02'
					}
				]
			},
			{
				slug: 'private',
				type: 'private',
				name: 'Kelas Private',
				title: 'AI-Driven Full-Stack Engineering - Private',
				badge: 'Private',
				priceAmount: 15000000,
				benefits: ['Roadmap personal', 'Review 1-on-1', 'Konsultasi produk'],
				schedules: ['Jadwal fleksibel', 'Mulai sesuai kesepakatan']
			}
		]
	},
	{
		slug: 'ai-led-system-architecture',
		title: 'AI-Led System Architecture',
		summary: 'Rancang sistem scalable, reliable, secure, observable, dan AI-ready.',
		eyebrow: 'Program Advanced',
		heroImage:
			'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=90',
		heroImageAlt: 'Engineering team membahas arsitektur sistem',
		intro: {
			eyebrow: 'Tentang Program',
			title: 'Rancang Sistem Sebelum Masalah Membesar',
			image:
				'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1100&q=90',
			imageAlt: 'Architect mempresentasikan rancangan sistem',
			paragraphs: ['Latih keputusan data, reliability, keamanan, dan trade-off arsitektur.'],
			checklist: ['Pernah membangun aplikasi production', 'Ingin memimpin keputusan teknis']
		},
		metrics: [
			{ label: '32 Pertemuan', value: '16 Minggu', icon: 'Clock3' },
			{ label: 'Executive Class', value: 'Hybrid', icon: 'MapPinned' },
			{ label: 'Level', value: 'Advanced', icon: 'UserRoundCheck' }
		],
		milestones: [
			{
				title: 'Architecture Basics',
				weeks: 'Minggu 1-4',
				description: 'Kebutuhan bisnis, constraints, dan keputusan teknis.',
				output: 'Architecture brief.',
				icon: 'foundation',
				technologies: ['github']
			},
			{
				title: 'Data & Scale',
				weeks: 'Minggu 5-8',
				description: 'Consistency, caching, messaging, dan scaling.',
				output: 'Data dan capacity plan.',
				icon: 'logic',
				technologies: ['postgresql', 'redis', 'apache-kafka']
			},
			{
				title: 'Reliable AI',
				weeks: 'Minggu 9-12',
				description: 'Guardrails, evaluation, observability, dan biaya AI.',
				output: 'AI service architecture.',
				icon: 'professional',
				technologies: ['openai', 'pinecone']
			},
			{
				title: 'Architecture Review',
				weeks: 'Minggu 13-16',
				description: 'Studi kasus dan architecture review.',
				output: 'Dokumen arsitektur.',
				icon: 'capstone',
				technologies: ['docker', 'github']
			}
		],
		offerings: [
			{
				slug: 'executive',
				type: 'batch',
				name: 'Executive Class',
				title: 'AI-Led System Architecture',
				badge: 'Cohort',
				priceAmount: 14500000,
				benefits: ['32 sesi intensif', 'Architecture review', 'Studi kasus industri'],
				batches: [
					{
						slug: 'cohort-002',
						title: 'Cohort #002',
						startDate: '2026-09-01',
						endDate: '2026-12-31',
						isOpen: false,
						registrationOpenAt: null,
						registrationCloseAt: null,
						capacity: null,
						locationType: 'onsite',
						location: null,
						days: [],
						startTime: null,
						endTime: null
					}
				]
			},
			{
				slug: 'private-advisory',
				type: 'private',
				name: 'Private Advisory',
				title: 'AI-Led System Architecture - Private',
				badge: 'Private',
				priceAmount: 19500000,
				benefits: ['Mentoring 1-on-1', 'Review sistem perusahaan', 'Roadmap teknis personal'],
				schedules: ['Jadwal fleksibel', 'Studi kasus dapat disesuaikan']
			}
		]
	}
] as const;

export const EVENT_SEED_DATA = [
	{
		slug: 'open-house-nuwaira-academy',
		title: 'Open House Nuwaira Academy',
		summary: 'Kenali program, mentor, dan metode belajar Nuwaira.',
		registrationUrl: '/#acara',
		isActive: true
	}
] as const;

export const PROGRAM_SHARED_SEED_DATA = {
	audienceBenefits: [
		{
			title: '1-on-1 Mentoring',
			description: 'Dibimbing mentor aktif yang mengerjakan proyek industri nyata.'
		},
		{
			title: 'Self Development',
			description: 'Dibekali komunikasi, problem solving, dan pola pikir profesional.'
		},
		{
			title: 'Project-Based Learning',
			description: 'Setiap materi menghasilkan output nyata yang dibangun bertahap.'
		}
	],
	facilities: [
		{
			label: 'Ruang Diskusi',
			imageUrl:
				'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
			imageAlt: 'Ruang diskusi modern'
		},
		{
			label: 'Musholla',
			imageUrl:
				'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85',
			imageAlt: 'Area interior gedung belajar'
		},
		{
			label: 'Taman',
			imageUrl:
				'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85',
			imageAlt: 'Taman hijau'
		},
		{
			label: 'Ruang Kelas',
			imageUrl:
				'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=85',
			imageAlt: 'Ruang kelas'
		},
		{
			label: 'Gazebo',
			imageUrl:
				'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=85',
			imageAlt: 'Gazebo terbuka'
		}
	],
	faqs: [
		{
			question: 'Apakah saya perlu punya background IT?',
			answer: 'Tidak. Program fundamental dirancang agar dapat dimulai dari nol.'
		},
		{
			question: 'Berapa lama durasi program?',
			answer: 'Durasi mengikuti program dan batch yang dipilih.'
		},
		{
			question: 'Apa bedanya kelas reguler dan private?',
			answer: 'Kelas private memiliki jadwal dan pendampingan yang lebih personal.'
		},
		{
			question: 'Apakah ada sertifikat?',
			answer: 'Peserta yang menyelesaikan program dan proyek akhir mendapatkan sertifikat.'
		}
	],
	registrationPerks: [
		{ title: 'Beasiswa hingga Rp500.000', description: 'Tersedia untuk peserta terpilih.' },
		{ title: 'Laptop AI Siap Pakai', description: 'Akses perangkat selama program.' },
		{ title: 'Exclusive Merchandise', description: 'Merchandise resmi untuk peserta.' }
	],
	socialLinks: [
		{ platform: 'Instagram', url: 'https://instagram.com/nuwaira', iconKey: 'Instagram' },
		{ platform: 'YouTube', url: 'https://youtube.com/@nuwaira', iconKey: 'Youtube' },
		{ platform: 'LinkedIn', url: 'https://linkedin.com/company/nuwaira', iconKey: 'Linkedin' },
		{ platform: 'Facebook', url: 'https://facebook.com/nuwaira', iconKey: 'Facebook' }
	]
} as const;
