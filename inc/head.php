<?php
/**
 * Document head — icons and browser chrome colors.
 *
 * @package Koen
 */

/**
 * Output favicon links and theme color.
 */
function koen_head_icons(): void {
	$koen_img_uri = get_template_directory_uri() . '/assets/img/';
	$koen_img_dir = get_template_directory() . '/assets/img/';
	?>
	<link rel="icon" href="<?php echo esc_url( $koen_img_uri . 'david-koen-ghost.svg' ); ?>" type="image/svg+xml">
	<?php if ( file_exists( $koen_img_dir . 'favicon.ico' ) ) : ?>
		<link rel="alternate icon" href="<?php echo esc_url( $koen_img_uri . 'favicon.ico' ); ?>" sizes="32x32">
	<?php endif; ?>
	<?php if ( file_exists( $koen_img_dir . 'apple-touch-icon.png' ) ) : ?>
		<link rel="apple-touch-icon" href="<?php echo esc_url( $koen_img_uri . 'apple-touch-icon.png' ); ?>">
	<?php endif; ?>
	<meta name="theme-color" content="#4B2E2B">
	<?php
}
add_action( 'wp_head', 'koen_head_icons' );