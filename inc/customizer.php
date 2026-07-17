<?php
/**
 * Customizer — footer contact details, socials, and copyright.
 *
 * @package Koen
 */

/**
 * Register footer controls.
 *
 * @param WP_Customize_Manager $wp_customize Customizer manager.
 */
function koen_customize_register( WP_Customize_Manager $wp_customize ): void {
	$wp_customize->add_section(
		'koen_footer',
		array(
			'title'    => __( 'Footer', 'koen' ),
			'priority' => 90,
		)
	);

	$koen_fields = array(
		'koen_footer_location_text' => array(
			'label'    => __( 'Location (display text)', 'koen' ),
			'default'  => 'Gauteng, South Africa',
			'sanitize' => 'sanitize_text_field',
		),
		'koen_footer_location_url'  => array(
			'label'    => __( 'Location (map link)', 'koen' ),
			'default'  => 'https://www.google.com/maps/place/Gauteng/@-26.018018,28.1300911,14z/data=!4m6!3m5!1s0x1e9512955411779f:0x6d9ee7c7cb5438e2!8m2!3d-26.2707593!4d28.1122679!16zL20vMDF0MDV0',
			'sanitize' => 'esc_url_raw',
		),
		'koen_footer_phone'         => array(
			'label'    => __( 'Mobile number', 'koen' ),
			'default'  => '+27 79 878 5862',
			'sanitize' => 'sanitize_text_field',
		),
		'koen_footer_email'         => array(
			'label'    => __( 'Email address', 'koen' ),
			'default'  => 'hello@davidkoen.tech',
			'sanitize' => 'sanitize_email',
		),
		'koen_footer_linkedin'      => array(
			'label'    => __( 'LinkedIn URL', 'koen' ),
			'default'  => 'https://www.linkedin.com/in/davidkoen/',
			'sanitize' => 'esc_url_raw',
		),
		'koen_footer_github'        => array(
			'label'    => __( 'GitHub URL', 'koen' ),
			'default'  => 'https://github.com/TheDavidKoen',
			'sanitize' => 'esc_url_raw',
		),
		'koen_footer_codepen'       => array(
			'label'    => __( 'CodePen URL', 'koen' ),
			'default'  => 'https://codepen.io/codepen-bragi',
			'sanitize' => 'esc_url_raw',
		),
		'koen_footer_copyright'     => array(
			'label'    => __( 'Copyright text (year is added automatically)', 'koen' ),
			'default'  => get_bloginfo( 'name' ),
			'sanitize' => 'sanitize_text_field',
		),
	);

	foreach ( $koen_fields as $koen_id => $koen_field ) {
		$wp_customize->add_setting(
			$koen_id,
			array(
				'default'           => $koen_field['default'],
				'sanitize_callback' => $koen_field['sanitize'],
			)
		);

		$wp_customize->add_control(
			$koen_id,
			array(
				'label'   => $koen_field['label'],
				'section' => 'koen_footer',
				'type'    => 'text',
			)
		);
	}
}
add_action( 'customize_register', 'koen_customize_register' );
