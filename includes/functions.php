<?php

defined( 'ABSPATH' ) || exit();

/**
 * Login a customer (set auth cookie and set global user object).
 *
 * @param int $customer_id Customer ID.
 */
function wr_user_frontend_set_auth_cookie( $customer_id ) {
	wp_set_current_user( $customer_id );
	wp_set_auth_cookie( $customer_id, true );
}

if ( ! function_exists( 'wp_radio_create_new_listener' ) ) {
	function wp_radio_create_new_listener( $email, $username = '', $password = '', $args = array() ) {
		if ( empty( $email ) || ! is_email( $email ) ) {
			return new WP_Error( 'registration-error-invalid-email', __( 'Please provide a valid email address.', 'woocommerce' ) );
		}

		if ( email_exists( $email ) ) {
			return new WP_Error( 'registration-error-email-exists', apply_filters( 'woocommerce_registration_error_email_exists', __( 'An account is already registered with your email address. Please log in.', 'woocommerce' ), $email ) );
		}

		$username = sanitize_user( $username );

		if ( empty( $username ) || ! validate_username( $username ) ) {
			return new WP_Error( 'registration-error-invalid-username', __( 'Please enter a valid account username.', 'woocommerce' ) );
		}

		if ( username_exists( $username ) ) {
			return new WP_Error( 'registration-error-username-exists', __( 'An account is already registered with that username. Please choose another.', 'woocommerce' ) );
		}

		if ( empty( $password ) ) {
			return new WP_Error( 'registration-error-missing-password', __( 'Please enter an account password.', 'woocommerce' ) );
		}

		// Use WP_Error to handle registration errors.
		$errors = new WP_Error();

		if ( $errors->get_error_code() ) {
			return $errors;
		}

		$new_listener_data = array(
			'user_login' => $username,
			'user_pass'  => $password,
			'user_email' => $email,
			'role'       => 'listener',
		);

		$listener_id = wp_insert_user( $new_listener_data );

		update_user_meta( $listener_id, 'first_name', $args['first_name'] );
		update_user_meta( $listener_id, 'last_name', $args['last_name'] );

		if ( is_wp_error( $listener_id ) ) {
			return $listener_id;
		}

		return $listener_id;
	}
}