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

async function initAbout() {
	const droppy = document.querySelector('[data-droppy]');
	if (!droppy) return;

	const { initDroppy } = await import('./droppy.js');
	initDroppy(droppy);
}

async function initCoffeeBuddy() {
	const buddy = document.querySelector('[data-coffee-buddy]');
	if (!buddy) return;

	const module = await import('./coffee-buddy.js');
	module.initCoffeeBuddy(buddy);
}

function init() {
	document.documentElement.classList.add('js');
	initFrontPage();
	initAbout();
	initCoffeeBuddy();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}