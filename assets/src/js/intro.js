/**
 * Intro loading screen — font-weight flicker + panel wipe.
 * Adapted from Paul Roger's "Build your board" CodePen (MIT), rebuilt on a
 * single variable font instead of nine Google font families.
 */
import { gsap } from 'gsap';

const WEIGHTS = [900, 200, 800, 300, 1000, 400, 700, 250, 600];

export async function playIntro(heroReady) {
	const intro = document.querySelector('.intro');

	if (!intro) {
		await heroReady;
		return;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		await heroReady;
		intro.remove();
		return;
	}

	const label = intro.querySelector('.intro__label');
	document.body.style.overflow = 'hidden';

	const flicker = gsap.timeline();
	WEIGHTS.forEach((weight) => {
		flicker.to(label, {
			duration: 0.1,
			fontVariationSettings: `'wght' ${weight}`,
		});
	});

	// If the scene is still loading after the flicker, pulse until it's ready.
	const pulse = gsap.to(label, {
		opacity: 0.25,
		duration: 0.5,
		yoyo: true,
		repeat: -1,
		ease: 'sine.inOut',
	});

	await Promise.all([flicker, heroReady]);

	pulse.kill();
	gsap.set(label, { opacity: 1 });

	const exit = gsap.timeline();
	exit.to('.intro__wipe', { duration: 1, scaleY: 2, ease: 'expo.inOut' });
	exit.to(intro, { duration: 1, scaleY: 0, ease: 'expo.inOut' }, '-=0.75');
	await exit;

	intro.remove();
	document.body.style.overflow = '';
}