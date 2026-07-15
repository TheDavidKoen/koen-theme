/**
 * Projects list — expand/collapse with GSAP Flip, adapted from the
 * "staggered list" CodePen (MIT). One item open at a time; links inside
 * an expanded item behave as links; keyboard accessible.
 */
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const DURATION = 0.5;

export function initProjects(items) {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let lastItems = [];
	let lastIndex = -1;

	items.forEach((item, i) => {
		const toggle = () => {
			const itemTargets = gsap.utils.toArray(item.querySelectorAll('*'));
			const isSameAsLast = i === lastIndex;
			const targets = isSameAsLast
				? items.concat(itemTargets)
				: items.concat(itemTargets.concat(lastItems));

			const state = Flip.getState(targets);

			if (!isSameAsLast && items[lastIndex]) {
				items[lastIndex].classList.remove('is-expanded');
				items[lastIndex].setAttribute('aria-expanded', 'false');
			}

			const expanded = item.classList.toggle('is-expanded');
			item.setAttribute('aria-expanded', String(expanded));

			if (!reduce) {
				Flip.from(state, {
					duration: DURATION,
					ease: 'power1.inOut',
					// Items stay in document flow so the list height animates
					// with them — content below glides instead of snapping.
					nested: true,
					onEnter: (elements) =>
						gsap.fromTo(
							elements,
							{ opacity: 0 },
							{ opacity: 1, duration: DURATION / 2, delay: DURATION / 2 }
						),
					onLeave: (elements) =>
						gsap.fromTo(
							elements,
							{ opacity: (index, el) => state.getProperty(el, 'opacity') },
							{ opacity: 0, duration: DURATION / 2 }
						),
				});
			}

			lastItems = itemTargets;
			lastIndex = i;
		};

		item.addEventListener('click', (e) => {
			if (e.target.closest('a')) return; // links inside stay links
			toggle();
		});

		item.addEventListener('keydown', (e) => {
			if ((e.key === 'Enter' || e.key === ' ') && e.target === item) {
				e.preventDefault();
				toggle();
			}
		});
	});
}