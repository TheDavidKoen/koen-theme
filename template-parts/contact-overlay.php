<?php
/**
 * Contact overlay — full-screen black-hole vortex with the contact form.
 *
 * TODO before launch: wire this form to a koen-core REST endpoint with
 * nonce, honeypot, and server-side validation (see contact-overlay.js).
 *
 * @package Koen
 */

?>
<div class="contact-overlay" data-contact-overlay hidden role="dialog" aria-modal="true" aria-labelledby="koen-contact-title">
	<div class="contact-overlay__stage" data-contact-stage aria-hidden="true"></div>

	<button type="button" class="contact-overlay__close" data-contact-close aria-label="<?php esc_attr_e( 'Close', 'koen' ); ?>">&times;</button>

	<form class="contact-form" novalidate>
		
		<h2 id="koen-contact-title" class="contact-form__title"><?php esc_html_e( 'Get in touch', 'koen' ); ?></h2>

		<p class="contact-form__lede"><?php esc_html_e( 'Please send me your details and why you would like to reach out, and I\'ll be sure to contact you ASAP.', 'koen' ); ?></p>

		<label class="visually-hidden" for="koen-contact-name"><?php esc_html_e( 'Name', 'koen' ); ?></label>
		<input type="text" id="koen-contact-name" name="name" autocomplete="name" placeholder="<?php esc_attr_e( 'Name', 'koen' ); ?>" required>

		<label class="visually-hidden" for="koen-contact-email"><?php esc_html_e( 'Email', 'koen' ); ?></label>
		<input type="email" id="koen-contact-email" name="email" autocomplete="email" placeholder="<?php esc_attr_e( 'Email', 'koen' ); ?>" required>

		<label class="visually-hidden" for="koen-contact-message"><?php esc_html_e( 'Message', 'koen' ); ?></label>
		<textarea id="koen-contact-message" name="message" placeholder="<?php esc_attr_e( 'Message', 'koen' ); ?>" required></textarea>

		<button type="submit" class="button"><?php esc_html_e( 'Send', 'koen' ); ?></button>

		<p class="contact-form__note" data-contact-note hidden>
			<?php esc_html_e( 'This form isn’t connected yet — it will be live soon.', 'koen' ); ?>
		</p>
		
	</form>
</div>