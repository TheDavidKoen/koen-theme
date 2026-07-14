<?php
/**
 * Coffee buddy — decorative cursor-watching mascot.
 *
 * Artwork adapted from Jonas Mosesson's "Moody Foodies" stickers via
 * Noel Delgado's CodePen (MIT); morph animation replaced with eye tracking
 * and CSS-animated steam. Desktop pointer devices only (see about.css)
 * and hidden from assistive tech.
 *
 * @package Koen
 */

?>
<svg class="coffee-buddy" viewBox="300 75 215 280" aria-hidden="true" focusable="false" data-coffee-buddy xmlns="http://www.w3.org/2000/svg">
	<defs>
		<path id="coffee-buddy-foot" d="M388,346 L395,346 C392.196088,337.186786 390.95329,325.697713 396,314" />
		<path id="coffee-buddy-steam" d="M0,0 C4,9 -4,19 0,28 C4,37 -4,47 0,56" />
		<clipPath id="coffee-buddy-clip">
			<path d="M312,190 L446,164 C455.679978,208.942066 460.800657,255.464673 463,303 C470.179673,326.771115 327.481478,334.20088 327,305 C322.662603,253.027247 317.662603,214.693913 312,190 Z" />
		</clipPath>
	</defs>
	<g fill="none" fill-rule="evenodd">
		<g class="coffee-buddy__steam" stroke="#D6D6BE" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" transform="translate(365, 85)">
			<use href="#coffee-buddy-steam" />
			<use href="#coffee-buddy-steam" x="28" />
			<use href="#coffee-buddy-steam" x="56" />
		</g>
		<path d="M364,346 L443,346" stroke="#C6C39A" stroke-linecap="round" stroke-width="8" />
		<g stroke="#4B2E2B" stroke-linecap="round" stroke-linejoin="round" stroke-width="7">
			<use href="#coffee-buddy-foot" />
			<use href="#coffee-buddy-foot" transform="translate(20, 0)" />
		</g>
		<path d="M456.068833,278.354024 L467.467696,278.354024 C486.549917,278.354024 487.600989,251.846024 467.467696,251.846024 L456.068833,251.846024 L456.068833,235.278523 L472.885983,235.278523 C506.866127,240.765221 503.336232,293.786731 472.885983,296.026024 L456.068833,296.026024 L456.068833,278.354024 Z" fill="#D6D6BE" />
		<path d="M312,190 L446,164 C455.679978,208.942066 460.800657,255.464673 463,303 C470.179673,326.771115 327.481478,334.20088 327,305 C322.662603,253.027247 317.662603,214.693913 312,190 Z" fill="#EAE6D8" />
		<path clip-path="url(#coffee-buddy-clip)" d="M431,160 C443,210 444,275 447,326 L470,320 L455,157 L431,160 Z" fill="#D6D6BE" />
		<g transform="translate(317 86)">
			<g transform="rotate(-10 69 118)">
				<path d="M69,118 C30.8923523,118 0,106.807119 0,93 C0,79.1928813 30.8923523,68 69,68 C107.107648,68 138,79.1928813 138,93 C138,106.807119 107.107648,118 69,118 Z M68,111 C101.68937,111 129,102.717268 129,92.5 C129,82.2827321 101.68937,74 68,74 C34.3106303,74 7,82.2827321 7,92.5 C7,102.717268 34.3106303,111 68,111 Z" fill="#F7F7E7" />
				<ellipse cx="68" cy="92.5" rx="61" ry="18.5" fill="#D6D6BE" />
				<ellipse cx="68" cy="93" rx="54" ry="15.5" fill="#4A4342" />
			</g>
		</g>
		<g transform="translate(360, 265)">
			<g data-coffee-eye>
				<ellipse cx="10.5" cy="11.5" rx="10.5" ry="11.5" fill="#FFFFFF" />
				<g data-coffee-pupil>
					<ellipse cx="10" cy="11" rx="7" ry="8" fill="#4A4342" />
					<circle cx="6" cy="8" r="4" fill="#FFFFFF" />
					<circle cx="14.5" cy="17.5" r="3.5" fill="#FFFFFF" />
				</g>
			</g>
			<g data-coffee-eye transform="translate(51, 0)">
				<ellipse cx="10.5" cy="11.5" rx="10.5" ry="11.5" fill="#FFFFFF" />
				<g data-coffee-pupil>
					<ellipse cx="10" cy="11" rx="7" ry="8" fill="#4A4342" />
					<circle cx="6" cy="8" r="4" fill="#FFFFFF" />
					<circle cx="14.5" cy="17.5" r="3.5" fill="#FFFFFF" />
				</g>
			</g>
			<path d="M18,29.25 L53,29.25" stroke="#4A4342" stroke-linecap="round" stroke-width="5" />
		</g>
	</g>
</svg>
