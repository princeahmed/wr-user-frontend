<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Enqueue {
	private static $instance = null;

	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	public static function enqueue_scripts() {
		wp_enqueue_style( 'wp-radio-user-frontend', WR_USER_FRONTEND_ASSETS . '/css/frontend.min.css', false, WR_USER_FRONTEND_VERSION );

		wp_enqueue_script( 'wp-radio-user-frontend', WR_USER_FRONTEND_ASSETS . '/js/frontend.min.js', [
			'jquery',
			'wp-util'
		], WR_USER_FRONTEND_VERSION, true );

		$localize_array = [
			'currentUserID' => get_current_user_id(),
			'i18n'          => [
				'loginAlert' => __( 'Please, Login to add this station to your favourite list.', 'wp-radio-user-frontend' )
			]
		];


		wp_localize_script( 'wp-radio-user-frontend', 'WRUF', $localize_array );

	}

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

}

WR_User_Frontend_Enqueue::instance();