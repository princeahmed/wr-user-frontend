<?php

defined( 'ABSPATH' ) || exit();

if(!class_exists('WR_User_Frontend_CPT')) {
	class WR_User_Frontend_CPT {
		private static $instance = null;

		public function __construct() {
			add_action( 'init', array( $this, 'register_post_types' ) );
		}

		public function register_post_types() {
			register_post_type( 'radio_review', [] );
		}

		public static function instance(){
			if(is_null(self::$instance)){
				self::$instance = new self();
			}

			return self::$instance;
		}

	}
}

WR_User_Frontend_CPT::instance();