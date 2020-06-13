<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Shortcode {

	function __construct() {
		$shortcodes = [
			'wp_radio_my_account'     => [ $this, 'my_account' ],
			'wp_radio_submit_station' => [ $this, 'submit_station' ],
		];

		foreach ( $shortcodes as $tag => $function ) {
			add_shortcode( $tag, $function );
		}
	}

	function my_account( $atts ) {

		ob_start();
		if ( ! is_user_logged_in() ) {
			wp_radio_get_template( 'my-account/form-login', [ 'atts' => $atts ], '', WR_USER_FRONTEND_TEMPLATES );
		} else {
			wp_radio_get_template( 'my-account/account', [ 'atts' => $atts ], '', WR_USER_FRONTEND_TEMPLATES );
		}

		return ob_get_clean();
	}

	function submit_station( $atts ) {

		ob_start();
		wp_radio_get_template( 'form-submit-station', [ 'atts' => $atts ], '', WR_USER_FRONTEND_TEMPLATES );

		return ob_get_clean();
	}


}

new WR_User_Frontend_Shortcode();