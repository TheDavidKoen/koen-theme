<?php
/**
 * Programming-evolution timeline — fixed left rail that draws itself with
 * scroll (adapted from a CodePen timeline; faker data replaced with real
 * milestones, IO reveal replaced with scroll-progress mapping).
 * Decorative: hidden from assistive tech and small viewports.
 *
 * @package Koen
 */

$koen_milestones = array(
	array( '1843', 'Ada Lovelace writes the first algorithm' ),
	array( '1936', 'Turing defines modern computation' ),
	array( '1957', 'FORTRAN — the first high-level language' ),
	array( '1972', 'C shapes systems programming' ),
	array( '1983', 'C++ popularizes object orientation' ),
	array( '1991', 'Python & the World Wide Web arrive' ),
	array( '1995', 'JavaScript & PHP power the dynamic web' ),
	array( '2008', 'GitHub makes collaboration social' ),
	array( '2013', 'React & component-driven UIs' ),
	array( '2015', 'Modern JavaScript (ES6) matures' ),
	array( '2021', 'GitHub Copilot brings AI pair programming' ),
	array( '2022', 'ChatGPT takes AI coding mainstream' ),
	array( '2024', 'AI agents review & refactor code' ),
	array( '2025', 'Agentic AI ships features end-to-end' ),
);
?>
<div class="prog-timeline" data-prog-timeline aria-hidden="true">
	<div class="prog-timeline__progress"></div>
	<ul class="prog-timeline__items">
		<?php foreach ( $koen_milestones as $koen_milestone ) : ?>
			<li class="prog-timeline__item">
				<time class="prog-timeline__year"><?php echo esc_html( $koen_milestone[0] ); ?></time>
				<span class="prog-timeline__label"><?php echo esc_html( $koen_milestone[1] ); ?></span>
			</li>
		<?php endforeach; ?>
	</ul>
</div>