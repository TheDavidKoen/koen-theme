<?php
/**
 * Projects list — "An idea of my work", expandable items (GSAP Flip).
 * Collapsed: featured image + title. Expanded: + description, stack, links.
 *
 * @package Koen
 */

$koen_projects = new WP_Query(
	array(
		'post_type'      => 'project',
		'posts_per_page' => 12,
		'no_found_rows'  => true,
	)
);

if ( ! $koen_projects->have_posts() ) {
	return;
}
?>
<section class="projects section" id="projects">
	<div class="droppy" data-droppy>
		<h2 class="droppy__text"><?php esc_html_e( 'An idea of my work', 'koen' ); ?></h2>
	</div>

	<ul class="projects__list container">
		<?php
		while ( $koen_projects->have_posts() ) :
			$koen_projects->the_post();

			$koen_stack    = (string) get_post_meta( get_the_ID(), '_koen_project_stack', true );
			$koen_live_url = (string) get_post_meta( get_the_ID(), '_koen_project_live_url', true );
			$koen_repo_url = (string) get_post_meta( get_the_ID(), '_koen_project_repo_url', true );
			?>
			<li class="project-item" data-project-item tabindex="0" role="button" aria-expanded="false">
				<div class="project-item__media">
					<?php the_post_thumbnail( 'medium', array( 'loading' => 'lazy' ) ); ?>
				</div>

				<h3 class="project-item__title"><?php the_title(); ?></h3>

				<div class="project-item__details">
					<div class="project-item__desc"><?php the_content(); ?></div>

					<?php if ( $koen_stack ) : ?>
						<ul class="project-item__stack">
							<?php foreach ( array_map( 'trim', explode( ',', $koen_stack ) ) as $koen_tech ) : ?>
								<li class="project-item__tag"><?php echo esc_html( $koen_tech ); ?></li>
							<?php endforeach; ?>
						</ul>
					<?php endif; ?>

					<?php if ( $koen_live_url || $koen_repo_url ) : ?>
						<div class="project-item__links">
							<?php if ( $koen_live_url ) : ?>
								<a class="button" href="<?php echo esc_url( $koen_live_url ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'View live', 'koen' ); ?></a>
							<?php endif; ?>
							<?php if ( $koen_repo_url ) : ?>
								<a class="button" href="<?php echo esc_url( $koen_repo_url ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'View code', 'koen' ); ?></a>
							<?php endif; ?>
						</div>
					<?php endif; ?>
				</div>
			</li>
		<?php endwhile; ?>
	</ul>
</section>
<?php
wp_reset_postdata();