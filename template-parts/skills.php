<?php
/**
 * Skills grid — "What I do" cards from the Skill post type (koen-core).
 * Canvas hover effect: assets/src/js/canvas-cards.js.
 *
 * @package Koen
 */

$koen_skills = new WP_Query(
	array(
		'post_type'      => 'skill',
		'posts_per_page' => 6,
		'orderby'        => 'menu_order title',
		'order'          => 'ASC',
		'no_found_rows'  => true,
	)
);

if ( ! $koen_skills->have_posts() ) {
	return;
}
?>
<section class="skills section" id="skills">
	<div class="droppy" data-droppy>
		<h2 class="droppy__text"><?php esc_html_e( 'What I do', 'koen' ); ?></h2>
	</div>

	<div class="skills__grid container">
		<?php
		while ( $koen_skills->have_posts() ) :
			$koen_skills->the_post();

			$koen_default_url = get_the_post_thumbnail_url( null, 'large' );
			$koen_hover_id    = (int) get_post_meta( get_the_ID(), '_koen_skill_hover_id', true );
			$koen_hover_url   = $koen_hover_id ? wp_get_attachment_image_url( $koen_hover_id, 'large' ) : '';
			?>
			<article class="skill-card" data-skill-card>
				<div
					class="skill-card__media"
					<?php if ( $koen_default_url && $koen_hover_url ) : ?>
						data-image-default="<?php echo esc_url( $koen_default_url ); ?>"
						data-image-hover="<?php echo esc_url( $koen_hover_url ); ?>"
					<?php endif; ?>
				>
					<?php the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); ?>
					<h3 class="skill-card__title"><?php the_title(); ?></h3>
				</div>
				<div class="skill-card__body"><?php the_content(); ?></div>
			</article>
		<?php endwhile; ?>
	</div>
</section>
<?php
wp_reset_postdata();
