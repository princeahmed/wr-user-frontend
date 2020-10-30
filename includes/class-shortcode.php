<?php

defined( 'ABSPATH' ) || exit();

if(!class_exists('WR_User_Frontend_Shortcode')) {
	class WR_User_Frontend_Shortcode {
		private static $instance = null;

		public function __construct() {
			$shortcodes = [
				'wp_radio_my_account'     => [ $this, 'my_account' ],
				'wp_radio_submit_station' => [ $this, 'submit_station' ],
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
			wp_radio_get_template( 'form-submit-station', [ 'atts' => $atts ], '', WR_USER_FRONTEND_TEMPLATES );

			return ob_get_clean();
		}

		public static function instance(){
			if(is_null(self::$instance)){
				self::$instance = new self();
			}

			return self::$instance;
		}
	}
}

WR_User_Frontend_Shortcode::instance();