<?php

/**
 * Plugin Name: WP Radio User Frontend
 * Plugin URI:  https://princeboss.com
 * Description: Engage Your Radio Listeners to your website.
 * Version:     1.1.1
 * Author:      Prince
 * Author URI:  http://princeboss.com
 * Text Domain: wp-radio-user-frontend
 * Domain Path: /languages/
 */

defined( 'ABSPATH' ) || exit();

if ( defined( 'WR_USER_FRONTEND_VERSION' ) ) {
	return;
}

define( 'WR_USER_FRONTEND_VERSION', '1.1.1' );
define( 'WR_USER_FRONTEND_FILE', __FILE__ );
define( 'WR_USER_FRONTEND_PATH', dirname( WR_USER_FRONTEND_FILE ) );
define( 'WR_USER_FRONTEND_INCLUDES', WR_USER_FRONTEND_PATH . '/includes' );
define( 'WR_USER_FRONTEND_URL', plugins_url( '', WR_USER_FRONTEND_FILE ) );
define( 'WR_USER_FRONTEND_ASSETS', WR_USER_FRONTEND_URL . '/assets' );
define( 'WR_USER_FRONTEND_TEMPLATES', WR_USER_FRONTEND_PATH . '/templates' );


register_activation_hook( __FILE__, function () {
	include_once WR_USER_FRONTEND_INCLUDES . '/class-install.php';
} );

include_once WR_USER_FRONTEND_INCLUDES . '/base.php';


