<?php

defined( 'ABSPATH' ) || exit;

/**
 * Class Install
 */

if(!class_exists('WP_Radio_User_Frontend_Install')) {
	class WP_Radio_User_Frontend_Install {

		public static function activate() {
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

				update_option( 'wp_radio_account_page', $account_page );

			}

			if ( ! get_page_by_title( 'Submit a Station' ) ) {
				$submit_page = wp_insert_post( array(
					'post_type'    => 'page',
					'post_title'   => esc_html__( 'Submit a Station', 'wp-radio-user-frontend' ),
					'post_status'  => 'publish',
					'post_content' => '[wp_radio_submit_station]',
				) );

				update_option( 'wp_radio_submit_station_page', $submit_page );
			}

		}

		private static function update_option() {
			$key = sanitize_key( wr_user_frontend()->name );
			update_option( $key . '_version', wr_user_frontend()->version );
			add_role( 'listener', __( 'Listener', 'wp-radio-user-frontend' ), [ 'read' => true ] );
		}

	}
}