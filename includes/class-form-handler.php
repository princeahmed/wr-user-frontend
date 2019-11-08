<?php

defined( 'ABSPATH' ) || exit;

class WR_User_Frontend_Form_Handler {
	function __construct() {
		add_action( 'template_redirect', [ $this, 'save_account_details' ] );

		add_action( 'wp_loaded', [ $this, 'process_login' ], 20 );
		add_action( 'wp_loaded', [ $this, 'process_registration' ], 20 );

		add_action( 'admin_post_submit_station', [ $this, 'process_submit_station' ], 20 );
		add_action( 'admin_post_nopriv_submit_station', [ $this, 'process_submit_station' ], 20 );
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
					throw new Exception( '<strong>' . __( 'Error:', 'wp-radio-user-frontend' ) . '</strong> ' . $validation_error->get_error_message() );
				}

				if ( empty( $creds['user_login'] ) ) {
					throw new Exception( '<strong>' . __( 'Error:', 'wp-radio-user-frontend' ) . '</strong> ' . __( 'Username is required.', 'wp-radio-user-frontend' ) );
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

					wp_redirect( wp_validate_redirect( $redirect, get_the_permalink( prince_get_option( 'account_page', get_option( 'wp_radio_account_page' ) ) ) ) );
					exit;
				}
			} catch ( Exception $e ) {
				wp_radio()->add_notice( 'error', $e->getMessage() );
			}
		}
	}

	function process_registration() {
		$nonce_value = isset( $_POST['_wpnonce'] ) ? wp_unslash( $_POST['_wpnonce'] ) : '';
		$nonce_value = isset( $_POST['wp-radio-register-nonce'] ) ? wp_unslash( $_POST['wp-radio-register-nonce'] ) : $nonce_value;

		if ( isset( $_POST['register'], $_POST['email'] ) && wp_verify_nonce( $nonce_value, 'wp-radio-register' ) ) {

			$username   = ! empty( $_POST['username'] ) ? wp_unslash( $_POST['username'] ) : '';
			$password   = ! empty( $_POST['password'] ) ? $_POST['password'] : '';
			$email      = sanitize_email( $_POST['email'] );
			$first_name = ! empty( $_POST['first_name'] ) ? sanitize_text_field( $_POST['first_name'] ) : '';
			$last_name  = ! empty( $_POST['last_name'] ) ? sanitize_text_field( $_POST['last_name'] ) : '';

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

					wp_radio()->add_notice( 'error', $messages );

					throw new Exception();
				}

				$args = [
					'first_name' => $first_name,
					'last_name'  => $last_name,
				];

				$new_listener = wp_radio_create_new_listener( sanitize_email( $email ), $username, $password, $args );

				if ( is_wp_error( $new_listener ) ) {
					throw new Exception( $new_listener->get_error_message() );
				}

				wp_radio()->add_notice( 'success', __( 'Your account was created successfully. Your login details have been sent to your email address.', 'wp-radio-user-frontend' ) );

				// Only redirect after a forced login - otherwise output a success notice.
				wp_set_current_user( $new_listener );
				wp_set_auth_cookie( $new_listener, true );

				if ( ! empty( $_POST['redirect'] ) ) {
					$redirect = wp_sanitize_redirect( wp_unslash( $_POST['redirect'] ) );
				} elseif ( wp_get_raw_referer() ) {
					$redirect = wp_get_raw_referer();
				} else {
					$redirect = get_the_permalink( prince_get_option( 'account_page' ) );
				}

				wp_redirect( wp_validate_redirect( $redirect, get_the_permalink( prince_get_option( 'account_page' ) ) ) );
				exit;

			} catch ( Exception $e ) {
				if ( $e->getMessage() ) {
					wp_radio()->add_notice( 'error', '<strong>' . __( 'Error:', 'wp-radio-user-frontend' ) . '</strong> ' . $e->getMessage() );
				}
			}
		}
	}

	function process_submit_station() {

		$args = [
			'post_status' => 'pending',
			'post_type'   => 'wp_radio',
		];

		$args['post_title']   = ! empty( $_REQUEST['title'] ) ? sanitize_text_field( $_REQUEST['title'] ) : '';
		$args['post_content'] = ! empty( $_REQUEST['content'] ) ? sanitize_textarea_field( $_REQUEST['content'] ) : '';

		$args['tax_input'] = [
			'radio_country' => ! empty( $_REQUEST['country'] ) ? intval( $_REQUEST['country'] ) : '',
			'radio_genre'   => ! empty( $_REQUEST['genres'] ) ? array_map( 'intval', $_REQUEST['genres'] ) : '',
		];

		$args['meta_input'] = [
			'language'        => ! empty( $_REQUEST['language'] ) ? sanitize_text_field( $_REQUEST['language'] ) : '',
			'stream_url'      => ! empty( $_REQUEST['stream_url'] ) ? esc_url( $_REQUEST['stream_url'] ) : '',
			'social_links'    => ! empty( $_REQUEST['social-links'] ) ? $_REQUEST['social-links'] : '',
			'contact_address' => ! empty( $_REQUEST['contact_address'] ) ? sanitize_textarea_field( $_REQUEST['contact_address'] ) : '',
			'contact_email'   => ! empty( $_REQUEST['contact_email'] ) ? sanitize_email( $_REQUEST['contact_email'] ) : '',
			'contact_phone'   => ! empty( $_REQUEST['contact_phone'] ) ? sanitize_text_field( $_REQUEST['contact_phone'] ) : '',
		];

		if ( ! empty( $_FILES['thumbnail'] ) && empty( $_FILES['thumbnail']['error'] ) ) {

			$type = wp_check_filetype( $_FILES['thumbnail']['name'] );

			if ( in_array( $type['type'], [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif' ] ) ) {
				$image_id = $this->upload_image( $_FILES['thumbnail'] );
			}
		}

		$post_id = wp_insert_post( $args );

		if ( is_wp_error( $post_id ) ) {
			wp_radio()->add_notice( 'error', __( 'Something went wrong please try again later.', 'wp-radio-user-frontend' ) );

			return;
		} else {
			wp_radio()->add_notice( 'success', __( 'Your request has been submitted. Now it is waiting for admin confirmation.', 'wp-radio-user-frontend' ) );
		}

		if ( ! empty( $image_id ) ) {
			update_post_meta( $post_id, 'logo', wp_get_attachment_url( $image_id ) );
		}

		//send email notification
		$subject = esc_html__( 'Request to add a station', 'wp-radio' );

		$to = prince_get_option( 'notification_email', get_option( 'admin_email' ) );

		$template_args = array_filter( [
			'Station Name'    => $args['post_title'],
			'Country'         => ! empty( $country_name = get_term( intval( $_REQUEST['country'] ) )->name ) ? $country_name : '',
			'Contact Address' => $args['meta_input']['contact_address'],
			'Contact Email'   => $args['meta_input']['contact_email'],
			'Contact Phone'   => $args['meta_input']['contact_phone'],
		] );

		ob_start();
		wp_radio_get_template( 'html-station-submit-email', [
			'post_id' => $post_id,
			'args'    => $template_args
		], '', WR_USER_FRONTEND_TEMPLATES );
		$email_message = ob_get_clean();

		$headers = array( 'Content-Type: text/html; charset=UTF-8' );

		wp_mail( $to, $subject, $email_message, $headers );

		wp_redirect( get_the_permalink( prince_get_option( 'submit_station_page', get_option( 'wp_radio_submit_station_page' ) ) ) );

	}

	function save_account_details() {
		$nonce_value = wp_radio_get_var( $_REQUEST['wp_radio_save_account_details_nonce'], wp_radio_get_var( $_REQUEST['_wpnonce'], '' ) );

		if ( ! wp_verify_nonce( $nonce_value, 'wp_radio_save_account_details' ) ) {
			return;
		}

		if ( empty( $_POST['action'] ) || 'wp_radio_save_account_details' !== $_POST['action'] ) {
			return;
		}

		$user_id = get_current_user_id();

		if ( $user_id <= 0 ) {
			return;
		}

		$first_name       = ! empty( $_POST['first_name'] ) ? wp_unslash( $_POST['first_name'] ) : '';
		$last_name        = ! empty( $_POST['last_name'] ) ? wp_unslash( $_POST['last_name'] ) : '';
		$email            = ! empty( $_POST['email'] ) ? wp_unslash( $_POST['email'] ) : '';
		$current_password = ! empty( $_POST['current_password'] ) ? $_POST['current_password'] : '';
		$new_password     = ! empty( $_POST['new_password'] ) ? $_POST['new_password'] : '';
		$confirm_password = ! empty( $_POST['confirm_password'] ) ? $_POST['confirm_password'] : '';
		$save_password    = true;

		// Current user data.
		$current_user = get_user_by( 'id', $user_id );

		// New user data.
		$user             = new stdClass();
		$user->ID         = $user_id;
		$user->first_name = $first_name;
		$user->last_name  = $last_name;

		// Handle required fields.
		$required_fields = [
			'first_name' => __( 'First name', 'wp-radio-user-frontend' ),
			'last_name'  => __( 'Last name', 'wp-radio-user-frontend' ),
			'email'      => __( 'Email address', 'wp-radio-user-frontend' ),
		];


		foreach ( $required_fields as $field_key => $field_name ) {
			if ( empty( $_POST[ $field_key ] ) ) {
				/* translators: %s: Field name. */
				wp_radio()->add_notice( 'error', sprintf( __( '%s is a required field.', 'wp-radio-user-frontend' ), '<strong>' . esc_html( $field_name ) . '</strong>' ) );
			}
		}

		if ( $email ) {
			$email = sanitize_email( $email );
			if ( ! is_email( $email ) ) {
				wp_radio()->add_notice( 'error', __( 'Please provide a valid email address.', 'wp-radio-user-frontend' ) );
			} elseif ( email_exists( $email ) && $email !== $current_user->user_email ) {
				wp_radio()->add_notice( 'error', __( 'This email address is already registered.', 'wp-radio-user-frontend' ) );
			}
			$user->user_email = $email;
		}

		if ( ! empty( $current_password ) && empty( $new_password ) && empty( $confirm_password ) ) {
			wp_radio()->add_notice( 'error', __( 'Please fill out all password fields.', 'wp-radio-user-frontend' ) );
			$save_password = false;
		} elseif ( ! empty( $new_password ) && empty( $current_password ) ) {
			wp_radio()->add_notice( 'error', __( 'Please enter your current password.', 'wp-radio-user-frontend' ) );
			$save_password = false;
		} elseif ( ! empty( $new_password ) && empty( $confirm_password ) ) {
			wp_radio()->add_notice( 'error', __( 'Please re-enter your password.', 'wp-radio-user-frontend' ) );
			$save_password = false;
		} elseif ( ( ! empty( $new_password ) || ! empty( $confirm_password ) ) && $new_password !== $confirm_password ) {
			wp_radio()->add_notice( 'error', __( 'New passwords do not match.', 'wp-radio-user-frontend' ) );
			$save_password = false;
		} elseif ( ! empty( $new_password ) && ! wp_check_password( $current_password, $current_user->user_pass, $current_user->ID ) ) {
			wp_radio()->add_notice( 'error', __( 'Your current password is incorrect.', 'wp-radio-user-frontend' ) );
			$save_password = false;
		}

		if ( $new_password && $save_password ) {
			$user->user_pass = $new_password;
		}

		if ( ! empty( $_FILES['avatar'] ) && empty( $_FILES['avatar']['error'] ) ) {

			$type = wp_check_filetype( $_FILES['avatar']['name'] );

			if ( in_array( $type['type'], [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif' ] ) ) {
				$avatar_img = $this->upload_image( $_FILES['avatar'] );
			} else {
				wp_radio()->add_notice( 'error', __( 'Please upload a valid image file.', 'wp-radio-user-frontend' ) );
			}
		}

		// Allow plugins to return their own errors.
		$errors = new WP_Error();

		if ( $errors->get_error_messages() ) {
			foreach ( $errors->get_error_messages() as $error ) {
				wp_radio()->add_notice( 'error', $error );
			}
		}

		if ( 0 === count( get_option( 'wp_radio_notification', 0 ) ) ) {
			wp_update_user( $user );

			if ( ! empty( $avatar_img ) ) {
				update_user_meta( $user->ID, 'avatar', $avatar_img );
			}

			wp_radio()->add_notice( 'success', __( 'Account details changed successfully.', 'wp-radio-user-frontend' ) );

			wp_safe_redirect( get_the_permalink( prince_get_option( 'account_page' ) ) );
			exit;
		}

	}

	function upload_image( $uploaded_file ) {
		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/file.php' );
		}
		$upload_overrides = array( 'test_form' => false );
		$move_file        = wp_handle_upload( $uploaded_file, $upload_overrides );
		if ( $move_file ) {
			$file      = $move_file['file'];
			$upload_id = wp_insert_attachment( array(
				'guid'           => $move_file['url'],
				'post_mime_type' => $move_file['type'],
				'post_content'   => '',
				'post_status'    => 'inherit'
			), $file, 0 );

			if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
				require_once( ABSPATH . 'wp-admin/includes/image.php' );
			}

			$attach_data = wp_generate_attachment_metadata( $upload_id, $move_file['file'] );
			wp_update_attachment_metadata( $upload_id, $attach_data );
		}

		return ! empty( $upload_id ) ? $upload_id : false;
	}

}

new WR_User_Frontend_Form_Handler();