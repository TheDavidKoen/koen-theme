<?php
/**
 * Front page — intro loader + spectral ghost hero.
 *
 * @package Koen
 */

get_header();
?>

<script>document.documentElement.classList.add( 'js' );</script>

<div class="intro" aria-hidden="true">
	<p class="intro__label">Loading</p>
	<div class="intro__wipe"><span><?php bloginfo( 'name' ); ?></span></div>
</div>

<section class="hero" data-hero-ghost>
	<div class="hero__content">
		<h1 class="hero__title"><?php bloginfo( 'name' ); ?></h1>
		<p class="hero__tagline"><?php bloginfo( 'description' ); ?></p>
	</div>
</section>

<section class="section container flow">
	<h2><?php esc_html_e( 'More coming soon', 'koen' ); ?></h2>
	<p><?php esc_html_e( 'Services, experience, and projects land here next.', 'koen' ); ?></p>
</section>

<?php
get_footer();
