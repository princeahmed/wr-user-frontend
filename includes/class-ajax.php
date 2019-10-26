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
		error_log( print_r( $_REQUEST, 1 ) );
		$post_id = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';
		$user_id = get_current_user_id();
		$type    = ! empty( $_REQUEST['type'] ) ? wp_unslash( $_REQUEST['type'] ) : '';

		$favourites = get_user_meta( $user_id, 'favourite_stations', true );
		if ( 'add' == $type ) {
			$favourites = array_merge( (array) $favourites, [ $post_id => $post_id ] );
		} else {
			unset( $favourites[ $post_id ] );
		}
		update_user_meta( $user_id, 'favourite_stations', $favourites );
		wp_send_json_success( true );
	}

	function check_favourite() {
		$id         = ! empty( $_REQUEST['id'] ) ? intval( $_REQUEST['id'] ) : '';
		$favourites = get_user_meta( get_current_user_id(), 'favourite_stations', true );
		wp_send_json_success( [
			'added' => in_array( $id, $favourites ),
		] );
	}
}

new WR_User_Frontend_Ajax();
