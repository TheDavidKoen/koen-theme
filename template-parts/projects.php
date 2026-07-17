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

// The projects intro lives below the More block in the front page's content.
$koen_front_page  = get_post( get_queried_object_id() );
$koen_front_parts = $koen_front_page ? get_extended( $koen_front_page->post_content ) : array( 'extended' => '' );
$koen_intro       = trim( $koen_front_parts['extended'] );
?>
<section class="projects section" id="projects">
	<div class="droppy" data-droppy>
		<h2 class="droppy__text"><?php esc_html_e( 'An idea of my work', 'koen' ); ?></h2>
	</div>

	<div class="projects__layout container<?php echo $koen_intro ? ' projects__layout--split' : ''; ?>">
		<?php if ( $koen_intro ) : ?>
			<div class="projects__intro flow">
				<?php echo wp_kses_post( apply_filters( 'the_content', $koen_intro ) ); ?>
			</div>
		<?php endif; ?>

		<button type="button" class="contact-portal" data-contact-open>
			<span class="contact-portal__stage" data-portal-stage aria-hidden="true"></span>
			<span class="contact-portal__label"><?php esc_html_e( 'Get in touch', 'koen' ); ?></span>
		</button>

		<ul class="projects__list">
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
	</div>
</section>
<?php
wp_reset_postdata();