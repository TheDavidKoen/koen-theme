<?php
/**
 * Theme supports.
 *
 * @package Koen
 */

/**
 * Register theme supports.
 */
function koen_setup(): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support(
		'html5',
		array( 'search-form', 'gallery', 'caption', 'script', 'style' )
	);
}
add_action( 'after_setup_theme', 'koen_setup' );
