/**
 * Footer particle backdrop — drifting bubbles and spinning ticks, adapted
 * from an "animated canvas particle background" CodePen (lodash dependency
 * removed, coordinates simplified). Cream and camel on the espresso footer.
 * Pauses while the footer is off-screen; skipped for reduced motion.
 */

const MAX_PARTICLES = 60;
const COLORS = ['192, 133, 82', '255, 248, 240', '255, 248, 240', '255, 248, 240', '255, 248, 240'];
const MAX_ALPHA = 0.55;

function sample(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

class Particle {
	constructor(w, h) {
		this.type = Math.random() < 0.2 ? 'line' : 'bubble';
		this.x = Math.random() * w;
		this.y = Math.random() * h;
		this.vx = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7;
		this.vy = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7;
		this.alpha = 0.05;
		this.rgb = sample(COLORS);
		this.strokeWidth = Math.random() * (Math.random() > 0.5 ? 1.5 : 2.5);

		if (this.type === 'bubble') {
			this.radius = 2 + Math.random() * 6;
		} else {
			this.angle = Math.random() * Math.PI * 2;
			this.length = sample([3, 5, 7, 10]);
			this.spin = (Math.PI / sample([10, 30, 60, 120])) * (Math.random() < 0.5 ? -1 : 1);
		}
	}

	update(w, h) {
		if (this.alpha < MAX_ALPHA) this.alpha += 0.005;
		this.x += this.vx;
		this.y += this.vy;
		if (this.type === 'line') this.angle += this.spin;

		return this.x > -5 && this.x < w + 5 && this.y > -5 && this.y < h + 5;
	}

	draw(ctx) {
		ctx.lineWidth = this.strokeWidth;
		ctx.strokeStyle = `rgba(${this.rgb}, ${this.alpha})`;
		ctx.save();

		if (this.type === 'line') {
			ctx.translate(this.x, this.y);
			ctx.rotate(this.angle);
			ctx.beginPath();
			ctx.moveTo(-this.length, 0);
			ctx.lineTo(this.length, 0);
		} else {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		}

		ctx.stroke();
		ctx.restore();
	}
}

export function initFooterParticles(footer) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const canvas = document.createElement('canvas');
	canvas.className = 'site-footer__canvas';
	canvas.setAttribute('aria-hidden', 'true');
	footer.prepend(canvas);

	const ctx = canvas.getContext('2d');
	const scale = Math.min(window.devicePixelRatio || 1, 2);
	let w = 0;
	let h = 0;
	let particles = [];
	let visible = false;

	function resize() {
		w = footer.offsetWidth;
		h = footer.offsetHeight;
		canvas.width = Math.ceil(w * scale);
		canvas.height = Math.ceil(h * scale);
		// CSS size must be set explicitly: an absolutely-positioned canvas
		// otherwise renders at its (2x) bitmap size and overflows the page.
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
		ctx.setTransform(scale, 0, 0, scale, 0, 0);
	}
	resize();

	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(resize, 250);
	});

	new IntersectionObserver((entries) => {
		visible = entries[0].isIntersecting;
	}).observe(footer);

	function loop() {
		requestAnimationFrame(loop);
		if (!visible) return;

		while (particles.length < MAX_PARTICLES) particles.push(new Particle(w, h));
		particles = particles.filter((p) => p.update(w, h));

		ctx.clearRect(0, 0, w, h);
		for (const p of particles) p.draw(ctx);
	}
	requestAnimationFrame(loop);
}