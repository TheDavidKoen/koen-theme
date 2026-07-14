<?php
/**
 * Theme supports, menus, and image sizes.
 *
 * @package Koen
 */

/**
 * Register theme supports and navigation menus.
 */
function koen_setup(): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support(
		'html5',
		array( 'search-form', 'gallery', 'caption', 'script', 'style', 'navigation-widgets' )
	);

	register_nav_menus(
		array(
			'primary' => __( 'Primary Navigation', 'koen' ),
			'footer'  => __( 'Footer Navigation', 'koen' ),
		)
	);
}
add_action( 'after_setup_theme', 'koen_setup' );
