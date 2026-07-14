<?php
/**
 * Front page — intro loader, spectral ghost hero, about section.
 *
 * The about body is this page's own content: edit it under Pages → Home.
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

<section class="about section" id="about">
	<div class="droppy" data-droppy>
		<h2 class="droppy__text"><?php esc_html_e( 'A little about me', 'koen' ); ?></h2>
	</div>

	<div class="about__content container flow">
		<?php
		while ( have_posts() ) {
			the_post();
			the_content();
		}
		?>
	</div>

	<?php get_template_part( 'template-parts/coffee-buddy' ); ?>
</section>

<?php
get_footer();
