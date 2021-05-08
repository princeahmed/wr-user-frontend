<?php

defined('ABSPATH') || exit();

final class WP_Radio_User_Frontend {

	protected static $instance = null;

	public function __construct() {
			$this->includes();
			$this->init_hooks();
	}

	function includes() {
		//core includes
		include_once WR_USER_FRONTEND_INCLUDES . '/class-form-handler.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/class-shortcode.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/class-hooks.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/class-enqueue.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/class-cpt.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/class-ajax.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/functions.php';

		//admin includes
		if ( is_admin() ) {
			include_once WR_USER_FRONTEND_INCLUDES . '/class-admin.php';
		}

	}

	function init_hooks() {

		// Localize our plugin
		add_action( 'init', [ $this, 'localization_setup' ] );
		add_action( 'init', [ $this, 'add_image_sizes' ] );

		//action_links
		add_filter( 'plugin_action_links_' . plugin_basename( WR_USER_FRONTEND_FILE ), [ $this, 'plugin_action_links' ] );
	}

	function localization_setup() {
		load_plugin_textdomain( 'wp-radio-user-frontend', false, dirname( plugin_basename( WR_USER_FRONTEND_FILE ) ) . '/languages/' );
	}

	function add_image_sizes() {
		add_image_size( 'wr_user_frontend_avatar_small', 32, 32, true );
		add_image_size( 'wr_user_frontend_avatar_large', 128, 128, true );
	}

	function plugin_action_links( $links ) {

		return $links;
	}

	static function instance() {

		if ( is_null( self::$instance ) ) {

			self::$instance = new self();
		}

		return self::$instance;
	}

}

function wr_user_frontend() {
	return WP_Radio_User_Frontend::instance();
}

wr_user_frontend();