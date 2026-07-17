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

async function initProjects() {
	const items = document.querySelectorAll('[data-project-item]');
	if (!items.length) return;

	const { initProjects: start } = await import('./projects.js');
	start(Array.from(items));
}

async function initContact() {
	const overlay = document.querySelector('[data-contact-overlay]');
	if (!overlay) return;

	const { initContactOverlay } = await import('./contact-overlay.js');
	initContactOverlay(overlay);
}

async function initFooter() {
	const footer = document.querySelector('[data-footer-particles]');
	if (!footer) return;

	const { initFooterParticles } = await import('./footer-particles.js');
	initFooterParticles(footer);
}

async function initProgTimeline() {
	const rail = document.querySelector('[data-prog-timeline]');
	if (!rail) return;

	const { initProgTimeline: start } = await import('./prog-timeline.js');
	start(rail);
}

function init() {
	document.documentElement.classList.add('js');
	initFrontPage();
	initAbout();
	initCoffeeBuddy();
	initFootsteps();
	initSkills();
	initProjects();
	initContact();
	initFooter();
	initProgTimeline();
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
