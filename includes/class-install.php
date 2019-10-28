<?php

defined( 'ABSPATH' ) || exit;

/**
 * Class Install
 */
class WR_User_Frontend_Install {

	public static function activate() {
		self::update_option();
		//self::create_pages();

	}

	private static function create_pages() {
		if ( get_page_by_title( 'Radio Stations' ) ) {
			return;
		}

		$id = wp_insert_post( array(
			'post_type'   => 'page',
			'post_title'  => esc_html__( 'Radio Stations', 'wp-radio' ),
			'post_status' => 'publish',
		) );

		update_option( 'wp_radio_stations_page', $id );

	}

	private static function update_option() {
		add_role( 'listener', __( 'Listener', 'wp-radio' ), [ 'read' => true ] );
	}

}