/**
 * Coffee buddy eye tracking — pupils follow the cursor.
 * Runs only on pointer-capable desktop viewports and pauses off-screen.
 */

const MAX_OFFSET = 3.5; // svg user units
const SMOOTHING = 0.15;

export function initCoffeeBuddy(svg) {
	const active = window.matchMedia('(min-width: 48em) and (hover: hover)');
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (!active.matches || reduce.matches) return;

	const eyes = Array.from(svg.querySelectorAll('[data-coffee-eye]')).map((el) => ({
		el,
		pupil: el.querySelector('[data-coffee-pupil]'),
		x: 0,
		y: 0,
	}));
	if (!eyes.length) return;

	let pointerX = window.innerWidth / 2;
	let pointerY = 0;
	let visible = false;

	window.addEventListener(
		'pointermove',
		(e) => {
			pointerX = e.clientX;
			pointerY = e.clientY;
		},
		{ passive: true }
	);

	new IntersectionObserver((entries) => {
		visible = entries[0].isIntersecting;
	}).observe(svg);

	// Screen-px to svg-unit ratio, refreshed on resize instead of per frame.
	let unitScale = 1;
	function measure() {
		const box = svg.getBoundingClientRect();
		unitScale = box.width > 0 ? 215 / box.width : 1;
	}
	measure();
	window.addEventListener('resize', measure, { passive: true });

	function tick() {
		requestAnimationFrame(tick);
		if (!visible) return;

		for (const eye of eyes) {
			const rect = eye.el.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = pointerX - cx;
			const dy = pointerY - cy;
			const dist = Math.min(Math.hypot(dx, dy) * unitScale * 0.02, MAX_OFFSET);
			const angle = Math.atan2(dy, dx);

			eye.x += (Math.cos(angle) * dist - eye.x) * SMOOTHING;
			eye.y += (Math.sin(angle) * dist - eye.y) * SMOOTHING;
			eye.pupil.setAttribute(
				'transform',
				`translate(${eye.x.toFixed(2)} ${eye.y.toFixed(2)})`
			);
		}
	}
	requestAnimationFrame(tick);
}