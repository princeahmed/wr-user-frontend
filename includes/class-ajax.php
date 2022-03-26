<?php

defined( 'ABSPATH' ) || exit();

if(!class_exists('WR_User_Frontend_Ajax')) {
	class WR_User_Frontend_Ajax {

		private static $instance = null;

		public function __construct() {
			add_action( 'wp_ajax_add_favorites', [ $this, 'handle_favorites' ] );
			add_action( 'wp_ajax_nopriv_add_favorites', [ $this, 'handle_favorites' ] );

			//check if a station is added to favorite
			add_action( 'wp_ajax_check_favourite', [ $this, 'check_favourite' ] );
			add_action( 'wp_ajax_nopriv_check_favourite', [ $this, 'check_favourite' ] );

			add_action( 'wp_ajax_load_more_favorites', [ $this, 'load_more_favorites' ] );
			add_action( 'wp_ajax_nopriv_load_more_favorites', [ $this, 'load_more_favorites' ] );

			add_action( 'wp_ajax_submit_review', [ $this, 'submit_review' ] );
			add_action( 'wp_ajax_nopriv_submit_review', [ $this, 'submit_review' ] );

			add_action( 'wp_ajax_load_more_reviews', [ $this, 'load_more_reviews' ] );
			add_action( 'wp_ajax_nopriv_load_more_reviews', [ $this, 'load_more_reviews' ] );

			//handle report submission
			add_action( 'wp_ajax_send_report', array( $this, 'send_report' ) );
			add_action( 'wp_ajax_nopriv_send_report', array( $this, 'send_report' ) );

		}

		public function handle_favorites() {

			$post_id = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';
			$user_id = get_current_user_id();
			$type    = ! empty( $_REQUEST['type'] ) ? wp_unslash( $_REQUEST['type'] ) : '';

			$favorites = get_user_meta( $user_id, 'favourite_stations', true );
			$favorites = ! empty( $favorites ) ? $favorites : [];

			if ( 'add' == $type ) {
				$favorites = array_merge( $favorites, [ $post_id ] );
			} else {
				if ( ( $key = array_search( $post_id, $favorites ) ) !== false ) {
					unset( $favorites[ $key ] );
				}
			}

			$favorites = array_unique( $favorites );

			update_user_meta( $user_id, 'favourite_stations', $favorites );
			wp_send_json_success( [ 'success' => true, 'favorites' => $favorites ] );
		}

		public function check_favourite() {
			$id         = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';
			$favorites = get_user_meta( get_current_user_id(), 'favourite_stations', true );
			$favorites = ! empty( $favorites ) ? $favorites : [];

			wp_send_json_success( [
				'added' => in_array( $id, $favorites ),
			] );
		}

		public function load_more_favorites() {
			$offset = ! empty( $_REQUEST['offset'] ) ? intval( $_REQUEST['offset'] ) : '';

			$favorites = wr_user_frontend_get_favorites( $offset );

			if ( ! empty( $favorites ) ) {
				ob_start();
				foreach ( $favorites as $post_id ) {
					$station = get_post( $post_id );
					wp_radio_get_template( 'listing/loop', [ 'station' => $station ] );
				}
				$html = ob_get_clean();

				wp_send_json_success( [ 'html' => $html ] );
			} else {
				wp_send_json_error();
			}
		}

		public function submit_review() {

			if ( ! wp_verify_nonce( $_REQUEST['nonce'], 'wp-radio' ) ) {
				wp_send_json_error();
			}

			$data = [];
			parse_str( $_REQUEST['formData'], $data );

			if ( empty( $data['rating'] ) || empty( $data['review'] ) || empty( $data['user_id'] ) || empty( $data['object_id'] ) ) {
				wp_send_json_error( __( 'Missing Require Field(s)', 'wp-radio-user-frontend' ) );
			}

			$meta_input = [
				'object_id' => intval( $data['object_id'] ),
				'user_id'   => intval( $data['user_id'] ),
				'rating'    => intval( $data['rating'] ),
			];

			$exits = get_page_by_title( md5( $data['object_id'] . $data['user_id'] ), OBJECT, 'radio_review' );

			if ( ! empty( $exits ) ) {
				$review_id = wp_update_post( [
					'ID'           => $exits->ID,
					'post_content' => sanitize_textarea_field( $data['review'] ),
					'meta_input'   => $meta_input
				] );
			} else {
				$review_id = wp_insert_post( [
					'post_title'   => md5( $meta_input['object_id'] . $meta_input['user_id'] ),
					'post_content' => sanitize_textarea_field( $data['review'] ),
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

			if ( ! wp_verify_nonce( $_REQUEST['nonce'], 'wp-radio' ) ) {
				wp_send_json_error( __( 'No Cheating, Hmm -_-', 'wp-radio-user-frontend' ) );
			}

			$data = [];
			parse_str( $_REQUEST['data'], $data );


			$email      = ! empty( $data['email'] ) ? sanitize_email( $data['email'] ) : '';
			$issue      = ! empty( $data['issue'] ) ? sanitize_text_field( $data['issue'] ) : '';
			$message    = ! empty( $data['message'] ) ? sanitize_textarea_field( $data['message'] ) : '';
			$station_id = ! empty( $data['id'] ) ? intval( $data['id'] ) : '';

			if ( empty( $email ) || empty( $issue ) ) {
				wp_send_json_error( [
					'type' => 'empty',
				] );
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

		public static function instance(){
			if(is_null(self::$instance)){
				self::$instance = new self();
			}

			return self::$instance;
		}

	}
}

WR_User_Frontend_Ajax::instance();