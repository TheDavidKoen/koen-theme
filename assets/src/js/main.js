import '../css/main.css';

async function initFrontPage() {
	const hero = document.querySelector('[data-hero-ghost]');
	if (!hero) return;

	// Scene + intro load in parallel; neither is in the main bundle.
	const heroReady = import('./hero-ghost.js')
		.then(({ initHeroGhost }) => initHeroGhost(hero))
		.catch(() => null);

	const { playIntro } = await import('./intro.js');
	await playIntro(heroReady);
	hero.classList.add('is-revealed');
}

function init() {
	document.documentElement.classList.add('js');
	initFrontPage();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}