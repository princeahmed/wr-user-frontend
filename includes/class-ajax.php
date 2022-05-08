<?php

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'WR_User_Frontend_Ajax' ) ) {
	class WR_User_Frontend_Ajax {

		private static $instance = null;

		public function __construct() {
			//add remove favorites
			add_action( 'wp_ajax_wp_radio_toggle_favorite', [ $this, 'toggle_favorites' ] );
			add_action( 'wp_ajax_nopriv_wp_radio_toggle_favorite', [ $this, 'toggle_favorites' ] );

			//check if a station is added to favorite
			add_action( 'wp_ajax_check_favourite', [ $this, 'check_favourite' ] );
			add_action( 'wp_ajax_nopriv_check_favourite', [ $this, 'check_favourite' ] );

			// Handle reviews
			add_action( 'wp_ajax_wp_radio_add_review', [ $this, 'add_review' ] );
			add_action( 'wp_ajax_nopriv_wp_radio_add_review', [ $this, 'add_review' ] );

			add_action( 'wp_ajax_wp_radio_delete_review', [ $this, 'delete_review' ] );
			add_action( 'wp_ajax_nopriv_wp_radio_delete_review', [ $this, 'delete_review' ] );

			add_action( 'wp_ajax_load_more_reviews', [ $this, 'load_more_reviews' ] );
			add_action( 'wp_ajax_nopriv_load_more_reviews', [ $this, 'load_more_reviews' ] );

			//handle report submission
			add_action( 'wp_ajax_wp_radio_report', array( $this, 'send_report' ) );
			add_action( 'wp_ajax_nopriv_wp_radio_report', array( $this, 'send_report' ) );

			// handle edit-account
			add_action( 'wp_ajax_wp_radio_edit_account', [ $this, 'edit_account' ] );
			add_action( 'wp_ajax_nopriv_wp_radio_edit_account', [ $this, 'edit_account' ] );

		}

		public function edit_account() {
			parse_str( $_POST['data'], $data );

			$errors = [];

			$nonce_value = ! empty( $data['_wpnonce'] ) ? $data['_wpnonce'] : '';
			if ( ! wp_verify_nonce( $nonce_value ) ) {
				$errors[] = __( 'Invalid request', 'wp-radio-user-frontend' );
			}

			$user_id = get_current_user_id();

			if ( $user_id <= 0 ) {
				$errors[] = __( 'You are not logged in', 'wp-radio-user-frontend' );
			}

			$first_name       = ! empty( $data['first_name'] ) ? sanitize_text_field( $data['first_name'] ) : '';
			$last_name        = ! empty( $data['last_name'] ) ? sanitize_text_field( $data['last_name'] ) : '';
			$email            = ! empty( $data['email'] ) ? sanitize_email( $data['email'] ) : '';
			$current_password = ! empty( $data['current_password'] ) ? $data['current_password'] : '';
			$new_password     = ! empty( $data['new_password'] ) ? $data['new_password'] : '';
			$confirm_password = ! empty( $data['confirm_password'] ) ? $data['confirm_password'] : '';
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
				if ( empty( $data[ $field_key ] ) ) {
					$errors[] = sprintf( __( '%s is required', 'wp-radio-user-frontend' ), $field_name );
				}
			}

			if ( $email ) {
				if ( ! is_email( $email ) ) {
					$errors[] = __( 'Email address is invalid', 'wp-radio-user-frontend' );
				} elseif ( email_exists( $email ) && $email !== $current_user->user_email ) {
					$errors[] = __( 'Email address already exists', 'wp-radio-user-frontend' );
				}

				$user->user_email = $email;
			}

			if ( ! empty( $current_password ) && empty( $new_password ) && empty( $confirm_password ) ) {
				$errors[]      = __( 'Please enter your new password', 'wp-radio-user-frontend' );
				$save_password = false;
			} elseif ( ! empty( $new_password ) && empty( $current_password ) ) {
				$errors[]      = __( 'Please enter your current password', 'wp-radio-user-frontend' );
				$save_password = false;
			} elseif ( ! empty( $new_password ) && empty( $confirm_password ) ) {
				$errors[]      = __( 'Please confirm your new password', 'wp-radio-user-frontend' );
				$save_password = false;
			} elseif ( ( ! empty( $new_password ) || ! empty( $confirm_password ) ) && $new_password !== $confirm_password ) {
				$errors[]      = __( 'New password and confirm password do not match', 'wp-radio-user-frontend' );
				$save_password = false;
			} elseif ( ! empty( $new_password ) && ! wp_check_password( $current_password, $current_user->user_pass, $current_user->ID ) ) {
				$errors[]      = __( 'Current password is incorrect', 'wp-radio-user-frontend' );
				$save_password = false;
			}

			if ( $new_password && $save_password ) {
				$user->user_pass = $new_password;
			}

			if ( empty( $errors ) ) {
				wp_update_user( $user );

				wp_send_json_success( [ 'success' => __( 'Account details updated successfully', 'wp-radio-user-frontend' ) ] );
			}

			wp_send_json_error( $errors );
		}

		public function toggle_favorites() {

			$user_id = get_current_user_id();

			if ( ! $user_id ) {
				wp_send_json_error( [ 'error' => __( 'You must be logged in to perform this action', 'wp-radio-user-frontend' ) ] );
			}

			$id   = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';
			$type = ! empty( $_REQUEST['type'] ) ? sanitize_key( $_REQUEST['type'] ) : 'add';

			$favorites = get_user_meta( $user_id, 'favourite_stations', true );
			$favorites = ! empty( $favorites ) ? $favorites : [];

			if ( 'add' == $type ) {
				$favorites = array_merge( $favorites, [ $id ] );
			} else {
				if ( ( $key = array_search( $id, $favorites ) ) !== false ) {
					unset( $favorites[ $key ] );
				}
			}

			$favorites = array_unique( $favorites );

			update_user_meta( $user_id, 'favourite_stations', $favorites );
			wp_send_json_success( $favorites );
		}

		public function check_favourite() {
			$id        = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';
			$favorites = get_user_meta( get_current_user_id(), 'favourite_stations', true );
			$favorites = ! empty( $favorites ) ? $favorites : [];

			wp_send_json_success( [
				'added' => in_array( $id, $favorites ),
			] );
		}

		public function delete_review() {
			$review_id = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';

			if ( ! $review_id ) {
				wp_send_json_error( [ 'error' => __( 'Invalid review ID', 'wp-radio-user-frontend' ) ] );
			}

			wp_delete_post( $review_id );
		}

		public function add_review() {

			$user_id = get_current_user_id();

			$object_id = ! empty( $_REQUEST['object_id'] ) ? intval( $_REQUEST['object_id'] ) : '';
			$rating    = ! empty( $_REQUEST['rating'] ) ? intval( $_REQUEST['rating'] ) : '';
			$review    = ! empty( $_REQUEST['review'] ) ? sanitize_textarea_field( $_REQUEST['review'] ) : '';

			if ( ! $object_id || ! $rating || ! $review ) {
				wp_send_json_error( __( 'Missing Require Field(s)', 'wp-radio-user-frontend' ) );
			}

			$meta_input = [
				'object_id' => $object_id,
				'user_id'   => $user_id,
				'rating'    => $rating,
			];

			$exits = get_page_by_title( md5( $object_id . $user_id ), OBJECT, 'radio_review' );

			if ( ! empty( $exits ) ) {
				$review_id = wp_update_post( [
					'ID'           => $exits->ID,
					'post_content' => $review,
					'meta_input'   => $meta_input
				] );
			} else {
				$review_id = wp_insert_post( [
					'post_title'   => md5( $object_id . $user_id ),
					'post_content' => $review,
					'post_type'    => 'radio_review',
					'post_status'  => 'publish',
					'meta_input'   => $meta_input
				] );
			}


			if ( is_wp_error( $review_id ) ) {
				wp_send_json_error( $review_id );
			}

			ob_start();
			wp_radio_get_template( 'review-loop', [ 'review_id' => $review_id ], '', WR_USER_FRONTEND_TEMPLATES );
			$html = ob_get_clean();

			wp_send_json_success( [ 'html' => $html, 'update' => ! empty( $exits ) ? 1 : 0 ] );

		}

		/**
		 * Load more reviews
		 */
		public function load_more_reviews() {
			$offset = ! empty( $_REQUEST['offset'] ) ? intval( $_REQUEST['offset'] ) : '';

			$reviews = get_posts( [
				'post_type'   => 'radio_review',
				'offset'      => $offset,
				'numberposts' => 10,
			] );

			if ( ! empty( $reviews ) ) {
				ob_start();
				foreach ( $reviews as $review ) {
					wp_radio_get_template( 'review-loop', [ 'review_id' => $review->ID ], '', WR_USER_FRONTEND_TEMPLATES );
				}
				$html = ob_get_clean();

				wp_send_json_success( [ 'html' => $html ] );
			} else {
				wp_send_json_error( __( 'No More Reviews!', 'wp-radio-user-frontend' ) );
			}
		}

		/**
		 * Send Report
		 *
		 * @return void
		 * @since 1.0.1
		 *
		 */
		public function send_report() {

			$email      = ! empty( $_REQUEST['email'] ) ? sanitize_email( $_REQUEST['email'] ) : '';
			$issue      = ! empty( $_REQUEST['issue'] ) ? sanitize_text_field( $_REQUEST['issue'] ) : '';
			$message    = ! empty( $_REQUEST['message'] ) ? sanitize_textarea_field( $_REQUEST['message'] ) : '';
			$station_id = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';

			if ( empty( $email ) || empty( $issue ) || empty( $station_id ) ) {
				wp_send_json_error( __( 'Missing Require Field(s)', 'wp-radio-user-frontend' ) );
			}

			$subject = sprintf( esc_html__( 'New Report submitted for %s Station', 'wp-radio-user-frontend' ), get_the_title( $station_id ) );

			$to = wp_radio_get_settings( 'notification_email', get_option( 'admin_email' ) );

			ob_start();

			wp_radio_get_template( 'html-report-email', [
				'email'      => $email,
				'issue'      => $issue,
				'message'    => $message,
				'station_id' => $station_id,
			], '', WR_USER_FRONTEND_TEMPLATES );

			$email_message = ob_get_clean();

			$headers = array( 'Content-Type: text/html; charset=UTF-8' );

			wp_mail( $to, $subject, $email_message, $headers );

			wp_send_json_success( true );

			exit();
		}

		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

	}
}

WR_User_Frontend_Ajax::instance();