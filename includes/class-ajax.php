<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Ajax {
	function __construct() {
		add_action( 'wp_ajax_add_favourites', [ $this, 'handle_favourites' ] );
		add_action( 'wp_ajax_nopriv_add_favourites', [ $this, 'handle_favourites' ] );

		add_action( 'wp_ajax_check_favourite', [ $this, 'check_favourite' ] );
		add_action( 'wp_ajax_nopriv_check_favourite', [ $this, 'check_favourite' ] );

		add_action( 'wp_ajax_load_more_favourites', [ $this, 'load_more_favourites' ] );
		add_action( 'wp_ajax_nopriv_load_more_favourites', [ $this, 'load_more_favourites' ] );

		add_action( 'wp_ajax_submit_review', [ $this, 'submit_review' ] );
		add_action( 'wp_ajax_nopriv_submit_review', [ $this, 'submit_review' ] );

		add_action( 'wp_ajax_load_more_reviews', [ $this, 'load_more_reviews' ] );
		add_action( 'wp_ajax_nopriv_load_more_reviews', [ $this, 'load_more_reviews' ] );

	}

	function handle_favourites() {

		$post_id = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';
		$user_id = get_current_user_id();
		$type    = ! empty( $_REQUEST['type'] ) ? wp_unslash( $_REQUEST['type'] ) : '';

		$favourites = get_user_meta( $user_id, 'favourite_stations', true );
		$favourites = ! empty( $favourites ) ? $favourites : [];

		if ( 'add' == $type ) {
			$favourites = array_merge( $favourites, [ $post_id ] );
		} else {
			if ( ( $key = array_search( $post_id, $favourites ) ) !== false ) {
				unset( $favourites[ $key ] );
			}
		}
		update_user_meta( $user_id, 'favourite_stations', $favourites );
		wp_send_json_success( true );
	}

	function check_favourite() {
		$id         = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';
		$favourites = get_user_meta( get_current_user_id(), 'favourite_stations', true );
		$favourites = ! empty( $favourites ) ? $favourites : [];

		wp_send_json_success( [
			'added' => in_array( $id, $favourites ),
		] );
	}

	function load_more_favourites() {
		$offset = ! empty( $_REQUEST['offset'] ) ? intval( $_REQUEST['offset'] ) : '';

		$favourites = wr_user_frontend_get_favourites( $offset );

		if ( ! empty( $favourites ) ) {
			ob_start();
			foreach ( $favourites as $post_id ) {
				$station = get_post( $post_id );
				wp_radio_get_template( 'listing/loop', [ 'station' => $station ] );
			}
			$html = ob_get_clean();

			wp_send_json_success( [ 'html' => $html ] );
		} else {
			wp_send_json_error();
		}
	}

	function submit_review() {

		if ( ! wp_verify_nonce( $_REQUEST['nonce'], 'wp-radio' ) ) {
			wp_send_json_error();
		}


		$data = [];
		parse_str( $_REQUEST['formData'], $data );

		if ( empty( $data['rating'] ) || empty( $data['review'] ) || empty( $data['user_id'] ) || empty( $data['object_id'] ) ) {
			wp_send_json_error( 'Missing Require Field(s)' );
		}

		$meta_input = [
			'object_id' => intval( $data['object_id'] ),
			'user_id'   => intval( $data['user_id'] ),
			'rating'    => intval( $data['rating'] ),
		];

		if ( ! empty( $data['update'] ) ) {
			$review_id = wp_update_post( [
				'ID'           => intval( $data['update'] ),
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

		wp_send_json_success( [ 'html' => $html, 'update' => ! empty( $data['update'] ) ? 1 : 0 ] );

	}

	function load_more_reviews() {
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
			wp_send_json_error('No More Reviews!');
		}
	}

}

new WR_User_Frontend_Ajax();