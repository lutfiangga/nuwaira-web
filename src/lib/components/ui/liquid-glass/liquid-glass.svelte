<script lang="ts" module>
	import type { Snippet } from "svelte";
	import type { HTMLAttributes, HTMLButtonAttributes } from "svelte/elements";
	import type { WithElementRef } from "$lib/utils.js";

	export type LiquidGlassVariant = "container" | "button" | "card";

	export type LiquidGlassProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLElement> &
		WithElementRef<HTMLButtonAttributes, HTMLElement> & {
			variant?: LiquidGlassVariant;
			label?: string;
			refraction?: number;
			depth?: number;
			dispersion?: number;
			frost?: number;
			splay?: number;
			lightAngle?: number;
			lightIntensity?: number;
			className?: string;
			children?: Snippet;
		};
</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";

	const uid = $props.id();
	const containerFilterId = `glass-${uid}`;
	const buttonFilterId = `glass-button-${uid}`;

	let {
		ref = $bindable(null),
		variant = "container",
		label = "",
		refraction = 80,
		depth = 35,
		dispersion = 48,
		frost = 0,
		splay = 0,
		lightAngle = -45,
		lightIntensity = 0.8,
		class: classProp,
		className,
		style,
		children,
		type = "button",
		...restProps
	}: LiquidGlassProps = $props();

	const clamp = (value: number, minimum = 0, maximum = 100) =>
		Math.min(maximum, Math.max(minimum, value));

	let settings = $derived({
		refraction: clamp(refraction),
		depth: clamp(depth),
		dispersion: clamp(dispersion),
		frost: clamp(frost),
		splay: clamp(splay),
		lightAngle: clamp(lightAngle, -360, 360),
		lightIntensity: clamp(lightIntensity > 1 ? lightIntensity / 100 : lightIntensity, 0, 1)
	});

	let displacementScale = $derived(settings.refraction * 0.42);
	let dispersionOffset = $derived(settings.dispersion * 0.003);
	let shadowBlur = $derived(settings.depth * 0.5);
	let shadowAlpha = $derived(settings.depth * 0.005);
	let frostAlpha = $derived(settings.frost * 0.003);

	let lightRadians = $derived((settings.lightAngle * Math.PI) / 180);
	let insetX = $derived((Math.cos(lightRadians) * settings.lightIntensity * 3).toFixed(1));
	let insetY = $derived((Math.sin(lightRadians) * settings.lightIntensity * 3).toFixed(1));

	let activeFilterId = $derived(
		variant === "button" ? buttonFilterId : containerFilterId
	);

	let componentStyle = $derived(
		[
			style,
			`--frost-alpha: ${frostAlpha}`,
			`--shadow-blur: ${shadowBlur}px`,
			`--shadow-alpha: ${shadowAlpha}`,
			`--inset-x: ${insetX}px`,
			`--inset-y: ${insetY}px`,
			`--splay-scale: ${1 + settings.splay * 0.0005}`,
			`--filter-id: url("#${activeFilterId}")`
		]
			.filter(Boolean)
			.join("; ")
	);
</script>

<svg class="glass-filter-definition" aria-hidden="true" focusable="false">
	<defs>
		<filter
			id={containerFilterId}
			x="-20%"
			y="-20%"
			width="140%"
			height="140%"
			color-interpolation-filters="sRGB"
		>
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.008 0.012"
				numOctaves="2"
				seed="2"
				result="noise"
			/>
			<feGaussianBlur in="noise" stdDeviation="3" result="soft-noise" />
			<feDisplacementMap
				in="SourceGraphic"
				in2="soft-noise"
				scale={displacementScale}
				xChannelSelector="R"
				yChannelSelector="G"
				result="displaced"
			/>
			<feColorMatrix
				type="matrix"
				values={`1 0 0 ${dispersionOffset} 0
					0 1 0 0 0
					0 0 1 ${-dispersionOffset} 0
					0 0 0 1 0`}
				in="displaced"
				result="chromatic"
			/>
			<feGaussianBlur stdDeviation="0.25" in="chromatic" />
		</filter>

		<filter
			id={buttonFilterId}
			x="-20%"
			y="-20%"
			width="140%"
			height="140%"
			color-interpolation-filters="sRGB"
		>
			<feTurbulence
				type="fractalNoise"
				baseFrequency="0.012 0.018"
				numOctaves="2"
				seed="5"
				result="noise"
			/>
			<feGaussianBlur in="noise" stdDeviation="2" result="soft-noise" />
			<feDisplacementMap
				in="SourceGraphic"
				in2="soft-noise"
				scale={displacementScale * 0.6}
				xChannelSelector="R"
				yChannelSelector="G"
				result="displaced"
			/>
			<feColorMatrix
				type="matrix"
				values={`1 0 0 ${dispersionOffset * 0.6} 0
					0 1 0 0 0
					0 0 1 ${dispersionOffset * -0.6} 0
					0 0 0 1 0`}
				in="displaced"
				result="chromatic"
			/>
			<feGaussianBlur stdDeviation="0.2" in="chromatic" />
		</filter>
	</defs>
</svg>

{#if variant === "button"}
	<button
		bind:this={ref}
		data-slot="liquid-glass"
		data-variant={variant}
		class={cn("glass-base glass-button", classProp, className)}
		style={componentStyle}
		aria-label={label || undefined}
		{type}
		{...restProps}
	>
		<span class="glass-content">
			{#if children}
				{@render children()}
			{:else}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<polygon points="6,3 20,12 6,21" fill="white" stroke="white" />
				</svg>
			{/if}
		</span>
	</button>
{:else}
	<div
		bind:this={ref}
		data-slot="liquid-glass"
		data-variant={variant}
		class={cn(
			"glass-base",
			variant === "card" ? "glass-card" : "glass-container",
			classProp,
			className
		)}
		style={componentStyle}
		{...restProps}
	>
		<div class="glass-content">
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.glass-base {
		position: relative;
		isolation: isolate;
		width: fit-content;
		height: fit-content;
	}

	.glass-base::before,
	.glass-base::after {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		content: "";
	}

	.glass-base::after {
		z-index: -1;
		overflow: hidden;
		isolation: isolate;
		background-color: rgb(255 255 255 / var(--frost-alpha, 0));
		-webkit-backdrop-filter: blur(0);
		backdrop-filter: blur(0);
		-webkit-filter: var(--filter-id);
		filter: var(--filter-id);
		transform: scale(var(--splay-scale, 1));
	}

	.glass-base::before {
		z-index: 1;
		box-shadow:
			inset var(--inset-x, 2px) var(--inset-y, 2px) 0 -2px rgb(255 255 255 / 0.7),
			inset 0 0 3px 1px rgb(255 255 255 / 0.7);
	}

	.glass-content {
		position: relative;
		z-index: 2;
	}

	.glass-container {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		overflow: visible;
		border-radius: 24px;
	}

	.glass-card {
		display: inline-flex;
		overflow: hidden;
		border-radius: 24px;
		box-shadow:
			0 var(--shadow-blur, 18px) calc(var(--shadow-blur, 18px) * 2)
				rgb(0 0 0 / var(--shadow-alpha, 0.18)),
			0 2px 8px rgb(0 0 0 / 0.1);
	}

	.glass-button {
		display: inline-flex;
		width: 70px;
		height: 70px;
		padding: 15px;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 9999px;
		background: transparent;
		outline: none;
		transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.glass-button::before {
		background-color: rgb(255 255 255 / 0.1);
	}

	.glass-button:hover {
		transform: scale(1.08);
	}

	.glass-button:active {
		transform: scale(0.95);
	}

	.glass-button:focus-visible {
		outline: 2px solid rgb(255 255 255 / 0.9);
		outline-offset: 3px;
	}

	.glass-button :global(svg) {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		stroke: white;
	}

	.glass-filter-definition {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
		pointer-events: none;
	}

	@media (prefers-reduced-transparency: reduce) {
		.glass-base::after {
			background-color: rgb(15 23 42 / 0.88);
			-webkit-backdrop-filter: none;
			backdrop-filter: none;
			-webkit-filter: none;
			filter: none;
		}
	}
</style>
