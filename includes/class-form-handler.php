<?php

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'WR_User_Frontend_Form_Handler' ) ) {

	class WR_User_Frontend_Form_Handler {
		private static $instance = null;

		public function __construct() {
			add_action( 'wp_loaded', [ $this, 'process_login' ], 20 );
			add_action( 'wp_loaded', [ $this, 'process_registration' ], 20 );

			add_action( 'admin_post_submit_station', [ $this, 'process_submit_station' ], 20 );
			add_action( 'admin_post_nopriv_submit_station', [ $this, 'process_submit_station' ], 20 );
		}

		/**
		 * handle user login
		 */
		public function process_login() {

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
							$redirect = get_the_permalink( wp_radio_get_settings( 'account_page' ) );
						}

						wp_redirect( wp_validate_redirect( $redirect, get_the_permalink( wp_radio_get_settings( 'account_page' ) ) ) );
						exit;
					}
				} catch ( Exception $e ) {
					wp_radio()->add_notice( 'error', $e->getMessage() );
				}
			}
		}

		/**
		 * handle user registration
		 */
		public function process_registration() {
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
						$redirect = get_the_permalink( wp_radio_get_settings( 'account_page' ) );
					}

					wp_redirect( wp_validate_redirect( $redirect, get_the_permalink( wp_radio_get_settings( 'account_page' ) ) ) );
					exit;

				} catch ( Exception $e ) {
					if ( $e->getMessage() ) {
						error_log( $e->getMessage() );
					}
				}
			}
		}

		/**
		 * handle station submission
		 */
		public function process_submit_station() {
			$redirect_url = get_the_permalink( wp_radio_get_settings( 'submit_station_page' ) );

			if ( ! wp_verify_nonce( $_REQUEST['_wpnonce'] ) ) {
				wp_redirect(add_query_arg( [ 'err' => 'nonce' ], $redirect_url ));
				return;
			}

			//check captcha
			$captcha      = ! empty( $_POST['captcha'] ) ? intval( $_POST['captcha'] ) : '';
			$captcha_code = ! empty( $_POST['captcha_code'] ) ? intval( $_POST['captcha_code'] ) : '';

			if ( $captcha != $captcha_code ) {
				wp_redirect(add_query_arg( [ 'err' => 'captcha' ], $redirect_url ));
				return;
			}


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


			if ( ! empty( $_FILES['thumbnail'] ) && empty( $_FILES['thumbnail']['error'] ) ) {

				$type = wp_check_filetype( $_FILES['thumbnail']['name'] );

				if ( in_array( $type['type'], [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif' ] ) ) {
					$image_id = $this->upload_image( $_FILES['thumbnail'] );
				}
			}

			$post_id = wp_insert_post( $args );

			if ( is_wp_error( $post_id ) ) {
				wp_redirect(add_query_arg( [ 'err' => 'error' ], $redirect_url ));

				return;
			} else {
				$metas = [
					'slogan'       => ! empty( $_REQUEST['slogan'] ) ? sanitize_text_field( $_REQUEST['slogan'] ) : '',
					'stream_url'   => ! empty( $_REQUEST['stream_url'] ) ? esc_url( $_REQUEST['stream_url'] ) : '',
					'website'      => ! empty( $_REQUEST['website'] ) ? esc_url( $_REQUEST['website'] ) : '',
					'facebook'     => ! empty( $_REQUEST['facebook'] ) ? esc_url( $_REQUEST['facebook'] ) : '',
					'twitter'      => ! empty( $_REQUEST['twitter'] ) ? esc_url( $_REQUEST['twitter'] ) : '',
					'address'      => ! empty( $_REQUEST['address'] ) ? sanitize_textarea_field( $_REQUEST['address'] ) : '',
					'email'        => ! empty( $_REQUEST['email'] ) ? sanitize_email( $_REQUEST['email'] ) : '',
					'phone'        => ! empty( $_REQUEST['phone'] ) ? sanitize_text_field( $_REQUEST['phone'] ) : '',
					'submitted_by' => get_current_user_id(),
				];

				foreach ( $metas as $key => $meta ) {
					update_post_meta( $post_id, $key, $meta );
				}
			}

			if ( ! empty( $image_id ) ) {
				update_post_meta( $post_id, 'logo', wp_get_attachment_url( $image_id ) );
			}

			//send email notification
			$subject = esc_html__( 'New Radio Station Submission', 'wp-radio-user-frontend' );

			$to = wp_radio_get_settings( 'notification_email', get_option( 'admin_email' ) );

			$template_args = array_filter( [
				'Station Name'    => $args['post_title'],
				'Country'         => ! empty( $country_name = get_term( intval( $_REQUEST['country'] ) )->name ) ? $country_name : '',
				'Contact Address' => wp_radio_get_meta( $post_id, 'address' ),
				'Contact Email'   => wp_radio_get_meta( $post_id, 'email' ),
				'Contact Phone'   => wp_radio_get_meta( $post_id, 'phone' ),
			] );


			$user = get_user_by( 'email', $to );

			ob_start();
			wp_radio_get_template( 'html-station-submit-email', [
				'post_id'   => $post_id,
				'args'      => $template_args,
				'user_name' => $user->data->display_name,
			], '', WR_USER_FRONTEND_TEMPLATES );
			$email_message = ob_get_clean();

			$headers = array( 'Content-Type: text/html; charset=UTF-8' );

			wp_mail( $to, $subject, $email_message, $headers );

			//redirect back to the submission page
			wp_redirect( add_query_arg( [ 'success' => 1 ], $redirect_url ) );

		}

		public function upload_image( $uploaded_file ) {
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

		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

	}
}

WR_User_Frontend_Form_Handler::instance();