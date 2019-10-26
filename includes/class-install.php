<?php

defined( 'ABSPATH' ) || exit;

/**
 * Class Install
 */
class WR_User_Frontend_Install {

	public static function activate() {
		var_dump('a');
		die();
		//self::create_pages();
		self::update_option();

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
		var_dump('a');
		die();
		add_role( 'custom_role', 'Custom Subscriber', array( 'read' => true) );
	}

}