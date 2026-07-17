/**
 * Skill cards — particle canvas hover effect.
 * Adapted from devloop01's "canvas image interaction" (MIT), simplified to
 * one particle style: dots roam the card painting the pixel color beneath
 * them; near a hovering cursor they repaint from the brighter image.
 * Desktop pointer devices only; the plain <img> remains the fallback and
 * rendering pauses while a card is off-screen.
 */

const PARTICLE_COUNT = 1200;
const MOUSE_RANGE = 80;
const MAX_VELOCITY = 5;

function randomBetween(min, max) {
	return min + Math.random() * (max - min);
}

function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

function imageDataFrom(image, width, height) {
	const offscreen = document.createElement('canvas');
	offscreen.width = width;
	offscreen.height = height;
	const ctx = offscreen.getContext('2d');

	// Cover semantics: scale to fill, center-crop the overflow — matches
	// the object-fit: cover of the <img> fallback.
	const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
	const drawWidth = image.naturalWidth * scale;
	const drawHeight = image.naturalHeight * scale;
	ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

	return ctx.getImageData(0, 0, width, height);
}

function pixelColor(imageData, width, x, y) {
	const i = (Math.floor(x) + Math.floor(y) * width) * 4;
	const { data } = imageData;
	return `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
}

class ParticleField {
	constructor(media) {
		this.media = media;
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.hovered = false;
		this.visible = true;
		this.mouse = { x: 0, y: 0 };
		this.particles = [];
	}

	async init() {
		[this.defaultImg, this.hoverImg] = await Promise.all([
			loadImage(this.media.dataset.imageDefault),
			loadImage(this.media.dataset.imageHover),
		]);

		this.resize();
		this.spawn();

		this.media.addEventListener('mouseenter', () => {
			this.hovered = true;
		});
		this.media.addEventListener('mouseleave', () => {
			this.hovered = false;
		});
		this.media.addEventListener('mousemove', (e) => {
			this.mouse.x = e.offsetX;
			this.mouse.y = e.offsetY;
		});

		new IntersectionObserver((entries) => {
			this.visible = entries[0].isIntersecting;
		}).observe(this.media);

		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => this.resize(), 250);
		});

		this.media.appendChild(this.canvas);
		this.media.classList.add('skill-card__media--canvas');
		requestAnimationFrame(() => this.render());
	}

	resize() {
		const rect = this.media.getBoundingClientRect();
		this.width = Math.max(1, Math.floor(rect.width));
		this.height = Math.max(1, Math.floor(rect.height));
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.dataDefault = imageDataFrom(this.defaultImg, this.width, this.height);
		this.dataHover = imageDataFrom(this.hoverImg, this.width, this.height);
	}

	spawn() {
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			this.particles.push({
				x: Math.random() * this.width,
				y: Math.random() * this.height,
				vx: (0.5 - Math.random()) * MAX_VELOCITY,
				vy: (0.5 - Math.random()) * MAX_VELOCITY,
				r: randomBetween(1, 2.2),
			});
		}
	}

	render() {
		requestAnimationFrame(() => this.render());
		if (!this.visible) return;

		for (const p of this.particles) {
			p.x += p.vx;
			p.y += p.vy;

			// Continue from the opposite edge instead of bouncing.
			if (p.x > this.width) p.x = 0;
			else if (p.x < 0) p.x = this.width;
			if (p.y > this.height) p.y = 0;
			else if (p.y < 0) p.y = this.height;

			const nearCursor =
				this.hovered && Math.hypot(p.x - this.mouse.x, p.y - this.mouse.y) < MOUSE_RANGE;
			const data = nearCursor ? this.dataHover : this.dataDefault;

			this.ctx.fillStyle = pixelColor(data, this.width, p.x, p.y);
			this.ctx.beginPath();
			this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			this.ctx.fill();
		}
	}
}

export function initSkillCards(cards) {
	// The scroll reveal runs on every device…
	const reveal = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-revealed');
					reveal.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.2 },
	);
	cards.forEach((card) => reveal.observe(card));

	// …the particle canvas only on hover-capable, motion-friendly devices.
	const active = window.matchMedia('(hover: hover) and (pointer: fine)');
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (!active.matches || reduce.matches) return;

	cards.forEach((card) => {
		const media = card.querySelector('[data-image-default]');
		if (media) {
			new ParticleField(media).init().catch(() => {
				// Images missing or failed: the plain <img> fallback stays.
			});
		}
	});
}
