/**
 * Footsteps — a two-footed follower that chases the cursor outside the hero.
 * Feet artwork adapted from a CodePen footprints demo; follower logic is
 * original: feet take alternating steps toward the cursor, leave fading
 * prints, and stand together beside the cursor when it rests.
 * Desktop pointer devices only.
 */

const STEP_LENGTH = 105; // px gained per step
const STANCE_WIDTH = 12; // px sideways offset per foot
const STEP_EVERY = 90; // ms between steps
const ARRIVE_RADIUS = 55; // px — closer than this means "arrived"
const WAIT_GAP = 30; // px the waiting feet keep from the cursor
const MAX_PRINTS = 30;

const DEFS = `
<svg class="footsteps__defs" width="0" height="0" aria-hidden="true">
	<defs>
		<path id="feet-shape" d="M41.5,30.2C36,24.6,4.7,26.1,7.7,49.4c.8,5.9,4,10.2,8,19.9,3,7.2-.1,15.7,5.8,20.8S43,91.6,38.6,75.9c-1.8-6.5-7.6-9.3-8.9-14.1C26.1,47.9,51.7,40.6,41.5,30.2Z M41.7,7.6c-2.6-.3-5.2,2.8-5.6,7s1.3,7.8,3.9,8.1,5.2-2.9,5.6-7.1S44.4,7.8,41.7,7.6Z M28.8,21.9c2.2.2,4.1-2.1,4.5-5.1s-1.1-5.7-3.2-6-4.1,2.1-4.5,5.1S26.7,21.6,28.8,21.9Z M20.1,23.3c1.6.1,3.1-1.8,3.4-4.4s-.8-4.7-2.4-4.9-3,1.8-3.3,4.3S18.5,23.1,20.1,23.3Z M14.9,25.5c1.4-.2,2.4-1.9,2.1-3.9s-1.6-3.4-3-3.3-2.4,2-2.2,3.9S13.4,25.7,14.9,25.5Z M10.9,29.2c1-.1,1.7-1.4,1.5-2.8s-1.1-2.5-2.2-2.4-1.7,1.4-1.6,2.8S9.8,29.3,10.9,29.2Z"/>
		<symbol id="feet-left" viewBox="0 0 100 100">
			<use href="#feet-shape"/>
		</symbol>
		<symbol id="feet-right" viewBox="0 0 100 100">
			<g transform="scale(-1, 1) translate(-100, 0)">
				<use href="#feet-shape"/>
			</g>
		</symbol>
	</defs>
</svg>`;

function makeFootSvg(href, className) {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('class', className);
	svg.setAttribute('viewBox', '0 0 100 100');
	const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	use.setAttribute('href', href);
	svg.appendChild(use);
	return svg;
}

export function initFootsteps(hero) {
	const active = window.matchMedia('(min-width: 48em) and (hover: hover)');
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (!active.matches || reduce.matches) return;

	const container = document.createElement('div');
	container.className = 'footsteps footsteps--hidden';
	container.setAttribute('aria-hidden', 'true');
	container.insertAdjacentHTML('beforeend', DEFS);
	document.body.appendChild(container);

	const feet = ['#feet-left', '#feet-right'].map((href) => {
		const el = makeFootSvg(href, 'footsteps__foot');
		container.appendChild(el);
		return { el, x: -100, y: -100, angle: Math.PI / 2 };
	});

	let target = null;
	let hidden = true;
	let stepFoot = 0;
	let restingAt = null;
	let departed = false;

	function place(foot, x, y, angle) {
		foot.x = x;
		foot.y = y;
		foot.angle = angle;
		foot.el.style.left = `${x}px`;
		foot.el.style.top = `${y}px`;
		foot.el.style.transform = `translate(-50%, -50%) rotate(${(angle * 180) / Math.PI + 90}deg)`;
	}

	function stampPrint(foot) {
		if (hidden || foot.x < 0) return;
		if (container.querySelectorAll('.footsteps__print').length > MAX_PRINTS) return;

		const print = makeFootSvg(
			feet.indexOf(foot) === 0 ? '#feet-left' : '#feet-right',
			'footsteps__print'
		);
		print.style.left = `${foot.x}px`;
		print.style.top = `${foot.y}px`;
		print.style.transform = `translate(-50%, -50%) rotate(${(foot.angle * 180) / Math.PI + 90}deg)`;
		print.addEventListener('animationend', () => print.remove());
		container.appendChild(print);
	}

	// Position both feet somewhere instantly, without the walking transition.
	function teleport(x, y, angle) {
		feet.forEach((foot, i) => {
			const side = i === 0 ? -1 : 1;
			foot.el.classList.add('is-teleporting');
			place(
				foot,
				x + Math.cos(angle + Math.PI / 2) * STANCE_WIDTH * side,
				y + Math.sin(angle + Math.PI / 2) * STANCE_WIDTH * side,
				angle
			);
		});
		requestAnimationFrame(() =>
			requestAnimationFrame(() =>
				feet.forEach((foot) => foot.el.classList.remove('is-teleporting'))
			)
		);
	}

	window.addEventListener(
		'pointermove',
		(e) => {
			const rect = hero.getBoundingClientRect();
			const inHero =
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom;

			if (inHero) {
				// Freeze the target where the cursor crossed in: the feet
				// finish the walk to that point, then fade out on arrival.
				departed = true;
				return;
			}

			departed = false;

			if (hidden) {
				hidden = false;
				teleport(e.pageX, e.pageY + WAIT_GAP, Math.PI / 2);
				requestAnimationFrame(() => container.classList.remove('footsteps--hidden'));
			}

			target = { x: e.pageX, y: e.pageY };
		},
		{ passive: true }
	);

	setInterval(() => {
		if (hidden || !target) return;

		const midX = (feet[0].x + feet[1].x) / 2;
		const midY = (feet[0].y + feet[1].y) / 2;
		const dx = target.x - midX;
		const dy = target.y - midY;
		const dist = Math.hypot(dx, dy);
		const angle = dist > 8 ? Math.atan2(dy, dx) : feet[stepFoot].angle;

		if (departed && dist <= ARRIVE_RADIUS) {
			hidden = true;
			container.classList.add('footsteps--hidden');
			target = null;
			restingAt = null;
			return;
		}

		if (dist > ARRIVE_RADIUS) {
			// Walking: the next foot hops ahead, but never inside the wait gap.
			restingAt = null;
			const foot = feet[stepFoot];
			const side = stepFoot === 0 ? -1 : 1;
			const reach = Math.min(STEP_LENGTH, dist - WAIT_GAP);
			stampPrint(foot);
			place(
				foot,
				midX + Math.cos(angle) * reach + Math.cos(angle + Math.PI / 2) * STANCE_WIDTH * side,
				midY + Math.sin(angle) * reach + Math.sin(angle + Math.PI / 2) * STANCE_WIDTH * side,
				angle
			);
			stepFoot = 1 - stepFoot;
		} else {
			const moved = restingAt
				? Math.hypot(target.x - restingAt.x, target.y - restingAt.y) > 12
				: true;
			const crowded = dist < WAIT_GAP * 0.75;

			if (moved || crowded) {
				// Arrived: both feet settle side by side, keeping their distance.
				restingAt = { x: target.x, y: target.y };
				feet.forEach((foot, i) => {
					const side = i === 0 ? -1 : 1;
					place(
						foot,
						target.x - Math.cos(angle) * WAIT_GAP + Math.cos(angle + Math.PI / 2) * STANCE_WIDTH * side,
						target.y - Math.sin(angle) * WAIT_GAP + Math.sin(angle + Math.PI / 2) * STANCE_WIDTH * side,
						angle
					);
				});
			}
		}
	}, STEP_EVERY);
}