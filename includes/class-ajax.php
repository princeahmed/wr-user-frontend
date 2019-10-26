<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Ajax {
	function __construct() {
		add_action( 'wp_ajax_add_favourites', [ $this, 'handle_favourites' ] );
		add_action( 'wp_ajax_nopriv_add_favourites', [ $this, 'handle_favourites' ] );

		add_action( 'wp_ajax_check_favourite', [ $this, 'check_favourite' ] );
		add_action( 'wp_ajax_nopriv_check_favourite', [ $this, 'check_favourite' ] );
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
			if (($key = array_search($post_id, $favourites)) !== false) {
				unset($favourites[$key]);
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
}

new WR_User_Frontend_Ajax();
