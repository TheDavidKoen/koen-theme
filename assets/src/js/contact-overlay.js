/**
 * Contact portal + overlay — adapted from a black-hole CodePen, rebranded.
 * The "Get in touch" button is a miniature vortex (hovering focuses the
 * stars into a ring); clicking opens the full-screen overlay where the
 * stars burst outward and stay scattered behind a transparent form.
 *
 * TODO before launch: wire the form submit to a koen-core REST endpoint
 * with nonce + honeypot + server-side validation. Until then, submitting
 * only reveals the "not connected yet" note.
 */

function rotatePoint(cx, cy, x, y, angle) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return [cos * (x - cx) + sin * (y - cy) + cx, cos * (y - cy) - sin * (x - cx) + cy];
}

class BlackHole {
	constructor(container, options = {}) {
		this.container = container;
		this.maxOrbit = options.maxOrbit ?? 255;
		this.count = options.count ?? 2500;
		this.bg = options.bg ?? 'rgba(44, 27, 24, 1)';
		this.trail = options.trail ?? 'rgba(44, 27, 24, 0.2)';
        this.starColors = options.starColors ?? ['255, 248, 240', '192, 133, 82'];
		this.stars = [];
		this.collapse = false;
		this.expanse = false;
		this.visible = true;
		this.rafId = 0;
		this.startTime = Date.now();
	}

	start() {
		const w = this.container.offsetWidth;
		const h = this.container.offsetHeight;
		this.w = w;
		this.h = h;
		this.cx = w / 2;
		this.cy = h / 2;

		this.canvas = document.createElement('canvas');
		this.canvas.style.width = `${w}px`;
		this.canvas.style.height = `${h}px`;
		const scale = Math.min(window.devicePixelRatio || 1, 2);
		this.canvas.width = Math.ceil(w * scale);
		this.canvas.height = Math.ceil(h * scale);
		this.ctx = this.canvas.getContext('2d');
		this.ctx.scale(scale, scale);
		this.container.appendChild(this.canvas);

		this.ctx.fillStyle = this.bg;
		this.ctx.fillRect(0, 0, w, h);

		for (let i = 0; i < this.count; i++) this.addStar(i);

		new IntersectionObserver((entries) => {
			this.visible = entries[0].isIntersecting;
		}).observe(this.container);

		this.loop();
	}

	// Overlay entrance: scatter across the screen and stay scrambled.
	burst() {
		this.collapse = false;
		this.expanse = true;
	}

	// Button hover: gather the swarm into a focused ring.
	setCollapse(value) {
		if (!this.expanse) this.collapse = value;
	}

	addStar(id) {
		const half = this.maxOrbit / 2;
		const orbital = (Math.random() * half + 1 + Math.random() * half + this.maxOrbit) / 2;
		const alpha = Math.max(0.05, 1 - orbital / (this.maxOrbit * 1.5));
		const collapseBonus = Math.max(0, orbital - this.maxOrbit * 0.7);

		this.stars.push({
			yOrigin: this.cy + orbital,
			x: this.cx,
			y: this.cy + orbital,
			speed: ((Math.floor(Math.random() * 2.5) + 1.5) * Math.PI) / 180,
			rotation: 0,
			startRotation: ((Math.floor(Math.random() * 360) + 1) * Math.PI) / 180,
			hoverPos: this.cy + half + collapseBonus,
			expansePos: this.cy + (id % 100) * -10 + Math.floor(Math.random() * 20) + 1,
			color: `rgba(${Math.random() > 0.3 ? this.starColors[0] : this.starColors[1]}, ${alpha})`,
			prevR: 0,
			prevX: this.cx,
			prevY: this.cy + orbital,
		});
	}

	drawStar(star, currentTime) {
		if (this.expanse) {
			star.rotation = star.startRotation + currentTime * (star.speed / 2);
			if (star.y > star.expansePos) {
				star.y -= Math.floor(star.expansePos - star.y) / -80;
			}
		} else if (this.collapse) {
			star.rotation = star.startRotation + currentTime * star.speed;
			if (star.y > star.hoverPos) star.y -= (star.hoverPos - star.y) / -5;
			if (star.y < star.hoverPos - 4) star.y += 2.5;
		} else {
			star.rotation = star.startRotation + currentTime * star.speed;
			if (star.y > star.yOrigin) star.y -= 2.5;
			if (star.y < star.yOrigin - 4) star.y += (star.yOrigin - star.y) / 10;
		}

		const ctx = this.ctx;
		ctx.save();
		ctx.strokeStyle = star.color;
		ctx.beginPath();
		const oldPos = rotatePoint(this.cx, this.cy, star.prevX, star.prevY, -star.prevR);
		ctx.moveTo(oldPos[0], oldPos[1]);
		ctx.translate(this.cx, this.cy);
		ctx.rotate(star.rotation);
		ctx.translate(-this.cx, -this.cy);
		ctx.lineTo(star.x, star.y);
		ctx.stroke();
		ctx.restore();

		star.prevR = star.rotation;
		star.prevX = star.x;
		star.prevY = star.y;
	}

	loop() {
		this.rafId = requestAnimationFrame(() => this.loop());
		if (!this.visible) return;

		const currentTime = (Date.now() - this.startTime) / 50;
		this.ctx.fillStyle = this.trail;
		this.ctx.fillRect(0, 0, this.w, this.h);

		for (const star of this.stars) this.drawStar(star, currentTime);
	}

	stop() {
		cancelAnimationFrame(this.rafId);
		this.canvas?.remove();
	}
}

export function initContactOverlay(overlay) {
	const openers = Array.from(document.querySelectorAll('[data-contact-open]'));
	const closeButton = overlay.querySelector('[data-contact-close]');
	const stage = overlay.querySelector('[data-contact-stage]');
	const form = overlay.querySelector('form');
	const note = overlay.querySelector('[data-contact-note]');
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Miniature vortex inside each "Get in touch" portal button.
	if (!reduce) {
		openers.forEach((button) => {
			const portalStage = button.querySelector('[data-portal-stage]');
			if (!portalStage) return;

			const size = Math.min(portalStage.offsetWidth, portalStage.offsetHeight);
			const mini = new BlackHole(portalStage, {
				maxOrbit: Math.floor(size * 0.42),
				count: 500,
				bg: 'rgba(255, 248, 240, 1)', // cream — invisible against the section
				trail: 'rgba(255, 248, 240, 0.2)',
				starColors: ['75, 46, 43', '140, 90, 60'], // espresso + warm brown
			});
			mini.start();

			button.addEventListener('mouseenter', () => mini.setCollapse(true));
			button.addEventListener('mouseleave', () => mini.setCollapse(false));
			button.addEventListener('focus', () => mini.setCollapse(true));
			button.addEventListener('blur', () => mini.setCollapse(false));
		});
	}

	let hole = null;
	let lastFocus = null;

	function onKeydown(e) {
		if (e.key === 'Escape') close();
	}

	function open() {
		lastFocus = document.activeElement;
		overlay.hidden = false;
		document.body.style.overflow = 'hidden';

		if (!reduce) {
			hole = new BlackHole(stage);
			hole.start();
			hole.burst();
		}

		overlay.querySelector('input')?.focus();
		document.addEventListener('keydown', onKeydown);
	}

	function close() {
		hole?.stop();
		hole = null;
		overlay.hidden = true;
		note.hidden = true;
		document.body.style.overflow = '';
		document.removeEventListener('keydown', onKeydown);
		lastFocus?.focus();
	}

	openers.forEach((button) => button.addEventListener('click', open));
	closeButton.addEventListener('click', close);

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		note.hidden = false; // TODO: replace with the real submission before launch.
	});
}