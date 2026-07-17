/**
 * "Droppy" ink-drop heading — adapted from the Droppy CodePen (MIT).
 * Letters rain into place while gooey ink pools behind them.
 * Vanilla-CSS port: the randomized drop shapes are generated per letter
 * here instead of via Sass, and the animation starts on scroll into view.
 * Each instance gets its own SVG filter id, so multiple headings coexist.
 */

const DELAY_BETWEEN_DROPS = 95;

let instanceCount = 0;

function randomBetween(min, max) {
	return min + Math.random() * (max - min);
}

export function initDroppy(root) {
	const text = root.querySelector('.droppy__text');
	if (!text) return;

	const filterId = `drops-filter-${++instanceCount}`;

	// Keep the heading readable for assistive tech before splitting it up.
	const original = text.textContent;
	text.setAttribute('aria-label', original);
	text.textContent = '';

	Array.from(original).forEach((char, index) => {
		const letter = document.createElement('span');
		letter.className = 'droppy__letter';
		letter.textContent = char;
		letter.setAttribute('aria-hidden', 'true');
		letter.style.setProperty('--delay', `${index * DELAY_BETWEEN_DROPS}ms`);
		text.appendChild(letter);
	});

	text.style.setProperty('--r', `${randomBetween(-3, 3)}deg`);

	root.insertAdjacentHTML(
		'beforeend',
		`<svg class="droppy__filter" aria-hidden="true"><filter id="${filterId}" x="-50%" width="200%" y="-50%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"/></filter></svg>`
	);

	// The ink layer: a non-heading clone of the letters, goo-filtered.
	const drops = document.createElement('div');
	drops.className = 'droppy__drops';
	drops.setAttribute('aria-hidden', 'true');
	drops.style.filter = `url(#${filterId})`;

	const cloneText = document.createElement('div');
	cloneText.className = 'droppy__text';
	cloneText.style.setProperty('--r', text.style.getPropertyValue('--r'));
	cloneText.innerHTML = text.innerHTML;
	cloneText.querySelectorAll('.droppy__letter').forEach((letter) => {
		letter.style.boxShadow = `${randomBetween(-0.03, 0.03)}em ${randomBetween(-0.03, 0.03)}em 0 ${randomBetween(0.2, 0.4)}em currentColor`;
	});

	drops.appendChild(cloneText);
	root.appendChild(drops);
	root.classList.add('droppy--ready');

	// Play once when scrolled into view; the finished heading then stays.
	new IntersectionObserver(
		(entries, observer) => {
			if (entries[0].isIntersecting) {
				root.classList.add('droppy--animated');
				observer.disconnect();
			}
		},
		{ threshold: 0.4 }
	).observe(root);
}