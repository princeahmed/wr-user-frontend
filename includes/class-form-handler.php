<?php

defined( 'ABSPATH' ) || exit;

class WR_User_Frontend_Form_Handler {
	function __construct() {
		add_action( 'wp_loaded', [ $this, 'process_login' ], 20 );
		add_action( 'wp_loaded', [ $this, 'process_registration' ], 20 );
	}

	function process_login() {

		$nonce_value = wp_radio_get_var( $_REQUEST['wp-radio-login-nonce'], wp_radio_get_var( $_REQUEST['_wpnonce'], '' ) );

		if ( isset( $_POST['login'], $_POST['username'], $_POST['password'] ) && wp_verify_nonce( $nonce_value, 'wp-radio-login' ) ) {

			try {
				$creds = [
					'user_login'    => trim( wp_unslash( $_POST['username'] ) ),
					'user_password' => $_POST['password'],
					'remember'      => isset( $_POST['rememberme'] ),
				];

				$validation_error = new WP_Error();

				if ( $validation_error->get_error_code() ) {
					throw new Exception( '<strong>' . __( 'Error:', 'wp-radio' ) . '</strong> ' . $validation_error->get_error_message() );
				}

				if ( empty( $creds['user_login'] ) ) {
					throw new Exception( '<strong>' . __( 'Error:', 'wp-radio' ) . '</strong> ' . __( 'Username is required.', 'wp-radio' ) );
				}

				// On multisite, ensure user exists on current site, if not add them before allowing login.
				if ( is_multisite() ) {
					$user_data = get_user_by( is_email( $creds['user_login'] ) ? 'email' : 'login', $creds['user_login'] );

					if ( $user_data && ! is_user_member_of_blog( $user_data->ID, get_current_blog_id() ) ) {
						add_user_to_blog( get_current_blog_id(), $user_data->ID, 'customer' );
					}
				}

				// Perform the login.
				$user = wp_signon( $creds, is_ssl() );

				if ( is_wp_error( $user ) ) {
					$message = $user->get_error_message();
					$message = str_replace( $creds['user_login'], '<strong>' . esc_html( $creds['user_login'] ) . '</strong>', $message );
					throw new Exception( $message );
				} else {

					if ( ! empty( $_POST['redirect'] ) ) {
						$redirect = wp_unslash( $_POST['redirect'] );
					} elseif ( wp_get_raw_referer() ) {
						$redirect = wp_get_raw_referer();
					} else {
						$redirect = get_the_permalink( prince_get_option( 'account_page' ) );
					}

					wp_redirect( wp_validate_redirect( $redirect, get_the_permalink( prince_get_option( 'account_page' ) ) ) );
					exit;
				}
			} catch ( Exception $e ) {
				add_filter( 'the_content', function ( $content ) use ( $e ) {
					$content .= '<p class="wp-radio-notice">' . $e->getMessage() . '</p>';

					return $content;
				} );
			}
		}
	}

	function process_registration() {
		$nonce_value = isset( $_POST['_wpnonce'] ) ? wp_unslash( $_POST['_wpnonce'] ) : '';
		$nonce_value = isset( $_POST['wp-radio-register-nonce'] ) ? wp_unslash( $_POST['wp-radio-register-nonce'] ) : $nonce_value;

		if ( isset( $_POST['register'], $_POST['email'] ) && wp_verify_nonce( $nonce_value, 'wp-radio-register' ) ) {
			$username = ! empty( $_POST['username'] ) ? wp_unslash( $_POST['username'] ) : '';
			$password = ! empty( $_POST['password'] ) ? $_POST['password'] : '';
			$email    = sanitize_email( $_POST['email'] );

			try {
				$validation_error  = new WP_Error();
				$validation_errors = $validation_error->get_error_messages();

				if ( 1 === count( $validation_errors ) ) {
					throw new Exception( $validation_error->get_error_message() );
				} elseif ( $validation_errors ) {
					$messages = '';
					foreach ( $validation_errors as $message ) {
						$messages .= '<p class="wp-radio-notice">' . $message . '</p>';
					}

					add_filter( 'the_content', function ( $content ) use ( $messages ) {
						$content .= $messages;

						return $content;
					} );

					throw new Exception();
				}

				$new_listener = wp_radio_create_new_listener( sanitize_email( $email ), wc_clean( $username ), $password );

				if ( is_wp_error( $new_listener ) ) {
					throw new Exception( $new_listener->get_error_message() );
				}

				add_filter( 'the_content', function ( $content ) {
					$content .= '<p class="wp-radio-notice">' . __( 'Your account was created successfully. Your login details have been sent to your email address.', 'wp-radio' ) . '</p>';

					return $content;
				} );

				// Only redirect after a forced login - otherwise output a success notice.
				if ( apply_filters( 'woocommerce_registration_auth_new_customer', true, $new_listener ) ) {
					wc_set_customer_auth_cookie( $new_listener );

					if ( ! empty( $_POST['redirect'] ) ) {
						$redirect = wp_sanitize_redirect( wp_unslash( $_POST['redirect'] ) );
					} elseif ( wp_get_raw_referer() ) {
						$redirect = wp_get_raw_referer();
					} else {
						$redirect = get_the_permalink( prince_get_option( 'account_page' ) );
					}

					wp_redirect( wp_validate_redirect( $redirect, get_the_permalink( prince_get_option( 'account_page' ) ) ) );
					exit;
				}
			} catch ( Exception $e ) {
				if ( $e->getMessage() ) {
					add_filter( 'the_content', function ( $content ) use ( $e ) {
						$content .= '<p class="wp-radio-notice">' . '<strong>' . __( 'Error:', 'wp-radio' ) . '</strong> ' . $e->getMessage() . '</p>';

						return $content;
					} );
				}
			}
		}
	}
}

new WR_User_Frontend_Form_Handler();