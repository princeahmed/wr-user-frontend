<?php

/**
 * Plugin Name: WP Radio User Frontend
 * Plugin URI:  https://princeboss.com
 * Description: Engage Your Radio Listeners to your website.
 * Version:     1.1.5
 * Author:      Prince
 * Author URI:  http://princeboss.com
 * Text Domain: wp-radio-user-frontend
 * Domain Path: /languages/
 */

defined( 'ABSPATH' ) || exit();

if ( ! function_exists( 'wr_user_frontend_fs' ) ) {
	// Create a helper function for easy SDK access.
	function wr_user_frontend_fs() {
		global $wr_user_frontend_fs;

		if ( ! isset( $wr_user_frontend_fs ) ) {
			// Activate multisite network integration.
			if ( ! defined( 'WP_FS__PRODUCT_4907_MULTISITE' ) ) {
				define( 'WP_FS__PRODUCT_4907_MULTISITE', true );
			}

			// Include Freemius SDK.
			if ( file_exists( dirname( dirname( __FILE__ ) ) . '/wp-radio/freemius/start.php' ) ) {
				// Try to load SDK from parent plugin folder.
				require_once dirname( dirname( __FILE__ ) ) . '/wp-radio/freemius/start.php';
			} elseif ( file_exists( dirname( dirname( __FILE__ ) ) . '/wp-radio-premium/freemius/start.php' ) ) {
				// Try to load SDK from premium parent plugin folder.
				require_once dirname( dirname( __FILE__ ) ) . '/wp-radio-premium/freemius/start.php';
			} else {
				require_once dirname( __FILE__ ) . '/freemius/start.php';
			}

			$wr_user_frontend_fs = fs_dynamic_init( array(
				'id'               => '4907',
				'slug'             => 'wp-radio-user-frontend',
				'type'             => 'plugin',
				'public_key'       => 'pk_bef0527f73d6c3a11a9bd4f5cd644',
				'is_premium'       => true,
				'is_premium_only'  => true,
				'has_paid_plans'   => true,
				'is_org_compliant' => false,
				'trial'            => array(
					'days'               => 3,
					'is_require_payment' => true,
				),
				'parent'           => array(
					'id'         => '4227',
					'slug'       => 'wp-radio',
					'public_key' => 'pk_6acab182f004d200ec631d063d6c4',
					'name'       => 'WP Radio - Worldwide Radio Station Directory',
				),
				'menu'             => array(
					'slug'       => 'edit.php?post_type=wp_radio',
					'first-path' => 'edit.php?post_type=wp_radio&page=get-started&tab=user_frontend',
					'support'    => false,
				),
				// Set the SDK to work in a sandbox mode (for development & testing).
				// IMPORTANT: MAKE SURE TO REMOVE SECRET KEY BEFORE DEPLOYMENT.
				'secret_key'       => 'sk_3pm3@)ftAf:N3?*MMgsScO@VQXB+.',
			) );
		}

		return $wr_user_frontend_fs;
	}
}


function wr_user_frontend_fs_is_parent_active_and_loaded() {
	// Check if the parent's init SDK method exists.
	return function_exists( 'wr_fs' );
}

function wr_user_frontend_fs_is_parent_active() {
	$active_plugins = get_option( 'active_plugins', array() );

	if ( is_multisite() ) {
		$network_active_plugins = get_site_option( 'active_sitewide_plugins', array() );
		$active_plugins         = array_merge( $active_plugins, array_keys( $network_active_plugins ) );
	}

	foreach ( $active_plugins as $basename ) {
		if ( 0 === strpos( $basename, 'wp-radio/' ) || 0 === strpos( $basename, 'wp-radio-premium/' ) ) {
			return true;
		}
	}

	return false;
}

function wr_user_frontend_fs_init() {

	if ( defined( 'WR_USER_FRONTEND_VERSION' ) ) {
		return;
	}

	define( 'WR_USER_FRONTEND_VERSION', '1.1.5' );
	define( 'WR_USER_FRONTEND_FILE', __FILE__ );
	define( 'WR_USER_FRONTEND_PATH', dirname( WR_USER_FRONTEND_FILE ) );
	define( 'WR_USER_FRONTEND_INCLUDES', WR_USER_FRONTEND_PATH . '/includes' );
	define( 'WR_USER_FRONTEND_URL', plugins_url( '', WR_USER_FRONTEND_FILE ) );
	define( 'WR_USER_FRONTEND_ASSETS', WR_USER_FRONTEND_URL . '/assets' );
	define( 'WR_USER_FRONTEND_TEMPLATES', WR_USER_FRONTEND_PATH . '/templates' );
	define( 'WR_USER_FRONTEND_NAME', 'WP Radio User Frontend' );
	define( 'WR_USER_FRONTEND_MIN_WP_RADIO', '3.0.9' );

	if ( wr_user_frontend_fs_is_parent_active_and_loaded() ) {
		// Init Freemius.
		wr_user_frontend_fs();

		if ( ! wr_user_frontend_fs()->can_use_premium_code__premium_only() ) {
			return;
		}

		// Signal that the add-on's SDK was initiated.
		do_action( 'wr_user_frontend_fs_loaded' );

		// Parent is active, add your init code here.

		//check min WP Radio version
		if ( defined( 'WP_RADIO_VERSION' ) && version_compare( WP_RADIO_VERSION, WR_USER_FRONTEND_MIN_WP_RADIO, '<' ) ) {
			add_action( 'admin_notices', function () {
				$notice = sprintf(
				/* translators: 1: Plugin name 2: WP Radio 3: Required WP Radio version */
					esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'wp-radio-user-frontend' ),
					'<strong>' . WR_USER_FRONTEND_NAME . '</strong>', '<strong>WP Radio</strong>',
					WR_USER_FRONTEND_MIN_WP_RADIO );
				?>
                <div class="notice is-dismissible notice-error">
                    <p><?php echo $notice; ?></p>
                </div>
			<?php } );

			return;
		}

		// Activation hook
		register_activation_hook( __FILE__, function () {
			include_once WR_USER_FRONTEND_INCLUDES . '/class-install.php';
		} );

		//Base file
		include_once WR_USER_FRONTEND_INCLUDES . '/base.php';

	} else {
		// Parent is inactive, add your error handling here.

		add_action( 'admin_notices', function () {
			$notice
				= sprintf(
			/* translators: 1: Plugin name 2: WP Radio */
				esc_html__( '"%1$s" requires "%2$s" to be installed and activated.',
					'wp-radio-user-frontend' ), '<strong>' . WR_USER_FRONTEND_NAME . '</strong>',
				'<strong>' . esc_html__( 'WP Radio', 'wp-radio-user-frontend' ) . '</strong>' );
			?>
            <div class="notice is-dismissible notice-error">
                <p><?php echo $notice; ?></p>
            </div>
		<?php } );
	}
}

if ( wr_user_frontend_fs_is_parent_active_and_loaded() ) {
	// If parent already included, init add-on.
	wr_user_frontend_fs_init();
} elseif ( wr_user_frontend_fs_is_parent_active() ) {
	// Init add-on only after the parent is loaded.
	add_action( 'wr_fs_loaded', 'wr_user_frontend_fs_init' );
} else {
	// Even though the parent is not activated, execute add-on for activation / uninstall hooks.
	wr_user_frontend_fs_init();
}


