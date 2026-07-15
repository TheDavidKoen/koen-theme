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
	const droppies = document.querySelectorAll('[data-droppy]');
	if (!droppies.length) return;

	const { initDroppy } = await import('./droppy.js');
	droppies.forEach((droppy) => initDroppy(droppy));
}

async function initCoffeeBuddy() {
	const buddy = document.querySelector('[data-coffee-buddy]');
	if (!buddy) return;

	const module = await import('./coffee-buddy.js');
	module.initCoffeeBuddy(buddy);
}

async function initFootsteps() {
	const hero = document.querySelector('[data-hero-ghost]');
	if (!hero) return;

	const { initFootsteps: start } = await import('./footsteps.js');
	start(hero);
}

async function initSkills() {
	const cards = document.querySelectorAll('[data-skill-card]');
	if (!cards.length) return;

	const { initSkillCards } = await import('./canvas-cards.js');
	initSkillCards(Array.from(cards));
}

function init() {
	document.documentElement.classList.add('js');
	initFrontPage();
	initAbout();
	initCoffeeBuddy();
	initFootsteps();
	initSkills();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}