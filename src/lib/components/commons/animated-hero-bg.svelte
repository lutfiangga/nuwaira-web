<div class="animated-hero-bg" aria-hidden="true">
	<div class="animated-hero-bg__scene">
		<div class="animated-hero-bg__wash"></div>
		<div class="animated-hero-bg__glow animated-hero-bg__glow--one"></div>
		<div class="animated-hero-bg__glow animated-hero-bg__glow--two"></div>
		<div class="animated-hero-bg__glow animated-hero-bg__glow--three"></div>
		<div class="animated-hero-bg__veil"></div>
	</div>
</div>

<style>
	.animated-hero-bg {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		background: #fff;
	}

	.animated-hero-bg__scene {
		position: absolute;
		inset: 0 0 10% 0;
		overflow: hidden;
	}

	.animated-hero-bg__wash {
		position: absolute;
		inset: -8%;
		background:
			radial-gradient(52% 44% at 86% 8%, rgba(66, 125, 255, 0.7) 0%, rgba(66, 125, 255, 0) 68%),
			radial-gradient(58% 52% at 64% 42%, rgba(29, 88, 212, 0.52) 0%, rgba(29, 88, 212, 0) 74%),
			radial-gradient(62% 56% at 22% 82%, rgba(203, 213, 227, 0.78) 0%, rgba(203, 213, 227, 0) 76%),
			linear-gradient(180deg, #0a1634 0%, #12295f 40%, #2f5fb0 72%, #a5bbdb 100%);
		filter: saturate(1.04) contrast(1.02) blur(2px);
		transform: scale(1.06);
		will-change: transform;
		animation: hero-wash-pan 24s ease-in-out infinite alternate;
	}

	.animated-hero-bg__glow {
		position: absolute;
		inset: -30%;
		filter: blur(52px);
		mix-blend-mode: screen;
		will-change: transform;
	}

	.animated-hero-bg__glow--one {
		opacity: 0.56;
		background:
			radial-gradient(42% 32% at 74% 12%, rgba(76, 139, 255, 0.58) 0%, rgba(76, 139, 255, 0) 74%),
			radial-gradient(42% 30% at 54% 32%, rgba(26, 80, 197, 0.34) 0%, rgba(26, 80, 197, 0) 76%);
		animation: hero-glow-float-a 18s cubic-bezier(0.42, 0, 0.58, 1) infinite alternate;
	}

	.animated-hero-bg__glow--two {
		opacity: 0.48;
		background:
			radial-gradient(46% 40% at 24% 72%, rgba(211, 219, 232, 0.52) 0%, rgba(211, 219, 232, 0) 75%),
			radial-gradient(32% 28% at 80% 62%, rgba(39, 98, 217, 0.32) 0%, rgba(39, 98, 217, 0) 74%);
		animation: hero-glow-float-b 26s cubic-bezier(0.42, 0, 0.58, 1) infinite alternate;
	}

	.animated-hero-bg__glow--three {
		opacity: 0.36;
		background:
			radial-gradient(30% 24% at 34% 18%, rgba(146, 182, 255, 0.48) 0%, rgba(146, 182, 255, 0) 74%),
			radial-gradient(34% 26% at 66% 40%, rgba(20, 70, 189, 0.34) 0%, rgba(20, 70, 189, 0) 76%);
		animation: hero-glow-float-c 22s cubic-bezier(0.42, 0, 0.58, 1) infinite alternate;
	}

	.animated-hero-bg__veil {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(64% 54% at 10% 8%, rgba(2, 9, 24, 0.58) 0%, rgba(2, 9, 24, 0) 72%),
			linear-gradient(
				180deg,
				rgba(2, 8, 22, 0.44) 0%,
				rgba(2, 8, 22, 0.14) 36%,
				rgba(2, 8, 22, 0.03) 70%,
				rgba(2, 8, 22, 0) 100%
			);
	}

	@keyframes hero-wash-pan {
		0% {
			transform: scale(1.06) translate3d(-1.8%, -2.4%, 0);
		}
		100% {
			transform: scale(1.1) translate3d(1.6%, -0.8%, 0);
		}
	}

	@keyframes hero-glow-float-a {
		0% {
			transform: translate3d(-2%, -3%, 0) scale(1);
		}
		100% {
			transform: translate3d(2.2%, -1.2%, 0) scale(1.05);
		}
	}

	@keyframes hero-glow-float-b {
		0% {
			transform: translate3d(2%, -3.2%, 0) scale(1.02);
		}
		100% {
			transform: translate3d(-2.2%, -1%, 0) scale(1.08);
		}
	}

	@keyframes hero-glow-float-c {
		0% {
			transform: translate3d(-1%, -3.4%, 0) scale(1.01);
		}
		100% {
			transform: translate3d(1.2%, -1.2%, 0) scale(1.06);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.animated-hero-bg__wash,
		.animated-hero-bg__glow--one,
		.animated-hero-bg__glow--two,
		.animated-hero-bg__glow--three {
			animation: none;
			transform: none;
		}
	}
</style>
