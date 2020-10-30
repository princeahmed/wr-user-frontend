<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Enqueue {
	private static $instance = null;

	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	public function enqueue_scripts() {
		wp_enqueue_style( 'select2', WR_USER_FRONTEND_ASSETS . '/css/select2.min.css', [], '4.0.11' );
		wp_enqueue_style( 'wp-radio-user-frontend', WR_USER_FRONTEND_ASSETS . '/css/frontend.min.css', [], wr_user_frontend()->version );

		wp_enqueue_script( 'select2', WR_USER_FRONTEND_ASSETS . '/js/select2.min.js', [ 'jquery' ], '4.0.11', true );
		wp_enqueue_script( 'wp-radio-user-frontend', WR_USER_FRONTEND_ASSETS . '/js/frontend.min.js', [
			'jquery',
			'select2',
			'wp-util'
		], wr_user_frontend()->version, true );

		$localize_array = [
			'i18n' => [
				'loginAlert' => __('Please, Login to add this station to your favourite list.', 'wp-radio-user-frontend')
			]
		];
		wp_localize_script('wp-radio-user-frontend', 'WRUF', $localize_array );

	}

	public static function instance(){
		if(is_null(self::$instance)){
			self::$instance = new self();
		}

		return self::$instance;
	}

}

WR_User_Frontend_Enqueue::instance();