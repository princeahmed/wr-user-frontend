<?php

defined( 'ABSPATH' ) || exit;

/**
 * Class Install
 */
class WP_Radio_User_Frontend_Install {

	private static $instance = null;

	public function __construct() {
		self::update_option();
		self::create_pages();

	}

	private static function create_pages() {

		if ( ! get_page_by_title( 'My Account' ) ) {
			$account_page = wp_insert_post( array(
				'post_type'    => 'page',
				'post_title'   => esc_html__( 'My Account', 'wp-radio-user-frontend' ),
				'post_status'  => 'publish',
				'post_content' => '[wp_radio_my_account]',
			) );

			$settings                 = (array) get_option( 'wp_radio_user_frontend_settings' );
			$settings['account_page'] = $account_page;

			update_option( 'wp_radio_user_frontend_settings', $settings );

		}

		if ( ! get_page_by_title( 'Submit a Station' ) ) {
			$submit_page = wp_insert_post( array(
				'post_type'    => 'page',
				'post_title'   => esc_html__( 'Submit a Station', 'wp-radio-user-frontend' ),
				'post_status'  => 'publish',
				'post_content' => '[wp_radio_submit_station]',
			) );

			$settings                        = (array) get_option( 'wp_radio_user_frontend_settings' );
			$settings['submit_station_page'] = $submit_page;

			update_option( 'wp_radio_user_frontend_settings', $settings );
		}

	}

	private static function update_option() {
		$key = sanitize_key( WR_USER_FRONTEND_NAME );
		update_option( $key . '_version', WR_USER_FRONTEND_VERSION );
		add_role( 'listener', __( 'Listener', 'wp-radio-user-frontend' ), [ 'read' => true ] );
	}

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

}

WP_Radio_User_Frontend_Install::instance();

