<?php
/**
 * Asset pipeline — bridges WordPress and Vite.
 *
 * Dev:  `npm run dev` writes assets/dist/hot; assets load from the Vite server (HMR).
 * Prod: `npm run build` writes hashed files + a manifest; we enqueue from that.
 *
 * @package Koen
 */

/**
 * Enqueue front-end scripts and styles.
 */
function koen_enqueue_assets(): void {
	$dist_dir = get_template_directory() . '/assets/dist/';
	$dist_uri = get_template_directory_uri() . '/assets/dist/';
	$hot_file = $dist_dir . 'hot';

	if ( file_exists( $hot_file ) ) {
		$origin = trim( (string) file_get_contents( $hot_file ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

		wp_enqueue_script( 'koen-vite-client', $origin . '/@vite/client', array(), KOEN_VERSION, false );
		wp_enqueue_script( 'koen-main', $origin . '/assets/src/js/main.js', array(), KOEN_VERSION, false );
		return;
	}

	$manifest = wp_json_file_decode( $dist_dir . '.vite/manifest.json', array( 'associative' => true ) );
	$entry    = $manifest['assets/src/js/main.js'] ?? null;

	if ( ! $entry ) {
		return;
	}

	wp_enqueue_script( 'koen-main', $dist_uri . $entry['file'], array(), KOEN_VERSION, false );

	foreach ( $entry['css'] ?? array() as $css_file ) {
		wp_enqueue_style( 'koen-main', $dist_uri . $css_file, array(), KOEN_VERSION );
	}
}
add_action( 'wp_enqueue_scripts', 'koen_enqueue_assets' );

/**
 * Vite outputs ES modules; mark our script tags accordingly.
 *
 * @param string $tag    The script tag.
 * @param string $handle The script handle.
 * @param string $src    The script source URL.
 * @return string
 */
function koen_module_script_tags( string $tag, string $handle, string $src ): string {
	if ( in_array( $handle, array( 'koen-vite-client', 'koen-main' ), true ) ) {
		return '<script type="module" src="' . esc_url( $src ) . '"></script>' . "\n"; // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Rewriting an already-enqueued script tag to type="module" for Vite.
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'koen_module_script_tags', 10, 3 );
