type SitemapEntry = {
	path: string;
	changeFrequency: 'daily';
	priority: '1.0' | '0.8';
};

type SearchIndexingProfile = {
	robotsMeta: string | null;
	googleBotMeta: string | null;
	xRobotsTag: string | null;
	robotsDirectives: readonly string[];
	sitemapEntries: readonly SitemapEntry[];
	includeSitemap: boolean;
	gtagId: string | null;
};

const STAGING_HOST_ALIASES = ['staging', 'stagging', 'stg'] as const;

const PUBLIC_SITEMAP_ENTRIES: readonly SitemapEntry[] = [
	{ path: '', changeFrequency: 'daily', priority: '1.0' },
	{ path: '/about', changeFrequency: 'daily', priority: '0.8' },
];

const SEARCH_INDEXING_PROFILES = {
	public: {
		robotsMeta: null,
		googleBotMeta: null,
		xRobotsTag: null,
		robotsDirectives: ['User-agent: *', 'Allow: /', 'Disallow: /panel/', 'Disallow: /login'],
		sitemapEntries: PUBLIC_SITEMAP_ENTRIES,
		includeSitemap: true,
		gtagId: ''
	},
	staging: {
		robotsMeta: 'noindex, nofollow',
		googleBotMeta: 'noindex, nofollow',
		xRobotsTag: 'noindex, nofollow',
		robotsDirectives: ['User-agent: *', 'Disallow: /'],
		sitemapEntries: [],
		includeSitemap: false,
		gtagId: null
	}
} as const satisfies Record<string, SearchIndexingProfile>;

const hasStagingHostnameAlias = (hostname: string) =>
	hostname
		.toLowerCase()
		.split('.')
		.some((label) => label.split('-').some((segment) => STAGING_HOST_ALIASES.includes(segment as (typeof STAGING_HOST_ALIASES)[number])));

const HOSTNAME_PROFILE_MAP = [
	{
		profile: 'staging',
		matches: hasStagingHostnameAlias
	}
] as const;

const resolveHostname = (url: URL | string) => (typeof url === 'string' ? new URL(url).hostname : url.hostname);

export const getSearchIndexingPolicy = (url: URL | string): SearchIndexingProfile => {
	const hostname = resolveHostname(url);
	const matchedProfile = HOSTNAME_PROFILE_MAP.find(({ matches }) => matches(hostname))?.profile ?? 'public';

	return SEARCH_INDEXING_PROFILES[matchedProfile];
};

export const buildRobotsTxt = (url: URL): string => {
	const policy = getSearchIndexingPolicy(url);
	const sitemapDirectives = policy.includeSitemap ? [`Sitemap: ${new URL('/sitemap.xml', url.origin).toString()}`] : [];

	return [...policy.robotsDirectives, ...sitemapDirectives].join('\n');
};

export const buildSitemapXml = (url: URL): string => {
	const policy = getSearchIndexingPolicy(url);
	const urls = policy.sitemapEntries
		.map(
			({ path, changeFrequency, priority }) => `  <url>
    <loc>${new URL(path || '/', url.origin).toString()}</loc>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

export const buildGoogleTagManagerScript = (id: string | null) => {
	if (!id) return '';
	return `
	<!-- Google Tag Manager -->
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());

		gtag('config', '${id}');
	</script>
<!-- End Google Tag Manager -->
	`;
};