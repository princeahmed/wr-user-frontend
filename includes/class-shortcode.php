<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Shortcode {
	private static $instance = null;

	function __construct() {
		$shortcodes = [
			'wp_radio_my_account'     => [ $this, 'my_account' ],
			'wp_radio_submit_station' => [ $this, 'submit_station' ],
			'wp_radio_user_favorites' => [ $this, 'user_favorites' ],
		];

		foreach ( $shortcodes as $tag => $function ) {
			add_shortcode( $tag, $function );
		}
	}

	public function my_account( $atts ) {

		ob_start();
		if ( ! is_user_logged_in() ) {
			wp_radio_get_template( 'my-account/form-login', [ 'atts' => $atts ], '', WR_USER_FRONTEND_TEMPLATES );
		} else {
			wp_radio_get_template( 'my-account/account', [ 'atts' => $atts ], '', WR_USER_FRONTEND_TEMPLATES );
		}

		return ob_get_clean();
	}

	public function submit_station( $atts ) {
		ob_start();
		wp_radio_get_template( 'submit-station', [ 'atts' => $atts ], '', WR_USER_FRONTEND_TEMPLATES );

		return ob_get_clean();
	}


	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function user_favorites( $atts ) {
		ob_start();
		wp_radio_get_template( 'user-favorites', [ 'atts' => $atts ], '', WR_USER_FRONTEND_TEMPLATES );

		return ob_get_clean();
	}


}

WR_User_Frontend_Shortcode::instance();