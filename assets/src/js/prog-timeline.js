/**
 * Programming-evolution rail — maps scroll position (hero bottom → footer
 * top) to a 0–1 progress that grows the line, lights milestones as it
 * reaches them, and swaps color while crossing the skills section.
 */

export function initProgTimeline(root) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// Live condition, not an init-time gate: the window may move between
	// monitors of different sizes at any point in the page's life.
	const wide = window.matchMedia('(min-width: 80em)');

	const hero = document.querySelector('[data-hero-ghost]');
	const footer = document.querySelector('.site-footer');
	const skills = document.querySelector('#skills');
	if (!hero || !footer) return;

	const items = Array.from(root.querySelectorAll('.prog-timeline__item'));
	let startY = 0;
	let endY = 1;
	let skillsTop = 0;
	let skillsBottom = 0;

	function measure() {
		const scrollY = window.scrollY;
		// Progress 0 only once the hero has fully left the viewport…
		startY = scrollY + hero.getBoundingClientRect().bottom;
		// …and progress 1 just before the footer's top edge appears.
		endY = scrollY + footer.getBoundingClientRect().top - window.innerHeight * 1.05;

		if (skills) {
			const rect = skills.getBoundingClientRect();
			skillsTop = scrollY + rect.top;
			skillsBottom = scrollY + rect.bottom;
		}
	}

	function update() {
		const y = window.scrollY;
		const progress = (y - startY) / (endY - startY);
		const active = wide.matches && progress >= 0 && progress <= 1;

		root.classList.toggle('prog-timeline--active', active);
		if (!active) return;

		root.style.setProperty('--progress', String(Math.min(1, Math.max(0, progress))));

		items.forEach((item, i) => {
			// Milestones map onto the first 90% of the journey, so the last
			// one lights up well before the rail fades out at the footer.
			item.classList.toggle(
				'prog-timeline__item--in',
				progress >= (i / (items.length - 1)) * 0.9 - 0.02
			);
		});

		const mid = y + window.innerHeight / 2;
		root.classList.toggle(
			'prog-timeline--alt',
			Boolean(skills) && mid >= skillsTop && mid <= skillsBottom
		);
	}

	let ticking = false;
	window.addEventListener(
		'scroll',
		() => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				update();
				ticking = false;
			});
		},
		{ passive: true }
	);

	window.addEventListener(
		'resize',
		() => {
			measure();
			update();
		},
		{ passive: true }
	);

	// Monitor moves can change the media match without a resize event.
	wide.addEventListener('change', () => {
		measure();
		update();
	});

	measure();
	update();
}