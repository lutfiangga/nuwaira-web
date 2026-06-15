import apacheKafka from 'thesvg/apache-kafka';
import css from 'thesvg/css';
import docker from 'thesvg/docker';
import drizzleOrm from 'thesvg/drizzle-orm';
import figma from 'thesvg/figma';
import git from 'thesvg/git';
import github from 'thesvg/github';
import googleAnalytics from 'thesvg/google-analytics';
import html5 from 'thesvg/html5';
import javascript from 'thesvg/javascript';
import nodejs from 'thesvg/nodedotjs';
import openai from 'thesvg/openai';
import pinecone from 'thesvg/pinecone';
import playwright from 'thesvg/playwright';
import postgresql from 'thesvg/postgresql';
import react from 'thesvg/react';
import redis from 'thesvg/redis';
import svelte from 'thesvg/svelte';
import tailwindCss from 'thesvg/tailwind-css';
import typescript from 'thesvg/typescript';
import vercel from 'thesvg/vercel';
import visualStudioCode from 'thesvg/visual-studio-code';

export const TECHNOLOGY_CATALOG = [
	{ key: 'visual-studio-code', name: 'VS Code', icon: visualStudioCode.svg },
	{ key: 'html5', name: 'HTML', icon: html5.svg },
	{ key: 'css', name: 'CSS', icon: css.svg },
	{ key: 'figma', name: 'Figma', icon: figma.svg },
	{ key: 'openai', name: 'OpenAI', icon: openai.svg },
	{ key: 'javascript', name: 'JavaScript', icon: javascript.svg },
	{ key: 'git', name: 'Git', icon: git.svg },
	{ key: 'github', name: 'GitHub', icon: github.svg },
	{ key: 'react', name: 'React', icon: react.svg },
	{ key: 'svelte', name: 'Svelte', icon: svelte.svg },
	{ key: 'tailwind-css', name: 'Tailwind CSS', icon: tailwindCss.svg },
	{ key: 'vercel', name: 'Vercel', icon: vercel.svg },
	{ key: 'google-analytics', name: 'Google Analytics', icon: googleAnalytics.svg },
	{ key: 'typescript', name: 'TypeScript', icon: typescript.svg },
	{ key: 'nodedotjs', name: 'Node.js', icon: nodejs.svg },
	{ key: 'postgresql', name: 'PostgreSQL', icon: postgresql.svg },
	{ key: 'drizzle-orm', name: 'Drizzle ORM', icon: drizzleOrm.svg },
	{ key: 'pinecone', name: 'Pinecone', icon: pinecone.svg },
	{ key: 'playwright', name: 'Playwright', icon: playwright.svg },
	{ key: 'docker', name: 'Docker', icon: docker.svg },
	{ key: 'redis', name: 'Redis', icon: redis.svg },
	{ key: 'apache-kafka', name: 'Apache Kafka', icon: apacheKafka.svg }
] as const;

export function getTechnologyIcon(key: string) {
	return TECHNOLOGY_CATALOG.find((item) => item.key === key)?.icon ?? null;
}
