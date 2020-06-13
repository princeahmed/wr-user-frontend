<?php

/**
 * Plugin Name: WP Radio User Frontend
 * Plugin URI:  https://princeboss.com
 * Description: Let Engage Users to your website.
 * Version:     1.0.2
 * Author:      Prince
 * Author URI:  http://princeboss.com
 * Text Domain: wp-radio-user-frontend
 * Domain Path: /languages/
 */

defined( 'ABSPATH' ) || exit();


/**
 * Main initiation class
 *
 * @since 1.0.0
 */
final class WP_Radio_User_Frontend {

	public $version = '1.0.2';

	public $min_php = '5.6.0';

	public $min_wp_radio = '2.0.8';

	public $name = 'WP Radio User Frontend';

	protected static $instance = null;

	public function __construct() {
		register_activation_hook( __FILE__, [ $this, 'install' ] );
		add_action( 'plugins_loaded', [ $this, 'let_the_journey_begin' ] );
	}

	function install() {
		include_once dirname( __FILE__ ) . '/includes/class-install.php';
		call_user_func( [ 'WP_Radio_User_Frontend_Install', 'activate' ] );
	}

	function let_the_journey_begin() {
		if ( $this->check_environment() ) {
			$this->define_constants();
			$this->includes();
			$this->init_hooks();
			do_action( 'wp_radio_user_frontend_loaded' );
		}
	}

	function check_environment() {

		$return = true;

		if ( version_compare( PHP_VERSION, $this->min_php, '<=' ) ) {
			$return = false;

			$notice = sprintf(
			/* translators: %s: Min PHP version */
				esc_html__( 'Unsupported PHP version Min required PHP Version: "%s"', 'wp-radio-user-frontend' ),
				$this->min_php
			);
		}

		// Check if WP Radio installed and activated
		if ( ! did_action( 'wp_radio_loaded' ) ) {
			$return = false;

			$notice = sprintf(
			/* translators: 1: Plugin name 2: WP Radio */
				esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'wp-radio-user-frontend' ),
				'<strong>' . $this->name . '</strong>',
				'<strong>' . esc_html__( 'WP Radio', 'wp-radio-user-frontend' ) . '</strong>'
			);

		}

		//check min WP Radio version
		if ( version_compare( WP_RADIO_VERSION, $this->min_wp_radio, '<' ) ) {
			$return = false;

			$notice = sprintf(
			/* translators: 1: Plugin name 2: WP Radio 3: Required WP Radio version */
				esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'wp-radio-user-frontend' ),
				'<strong>' . $this->name . '</strong>',
				'<strong>' . esc_html__( 'WP Radio', 'wp-radio-user-frontend' ) . '</strong>',
				$this->min_wp_radio
			);
		}

		if ( ! $return ) {

			add_action( 'admin_notices', function () use ( $notice ) { ?>
                <div class="notice is-dismissible notice-error">
                    <p><?php echo $notice; ?></p>
                </div>
			<?php } );

			if ( ! function_exists( 'deactivate_plugins' ) ) {
				require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			deactivate_plugins( plugin_basename( __FILE__ ) );

			return $return;
		} else {
			return $return;
		}

	}

	function define_constants() {
		define( 'WR_USER_FRONTEND_VERSION', $this->version );
		define( 'WR_USER_FRONTEND_FILE', __FILE__ );
		define( 'WR_USER_FRONTEND_PATH', dirname( WR_USER_FRONTEND_FILE ) );
		define( 'WR_USER_FRONTEND_INCLUDES', WR_USER_FRONTEND_PATH . '/includes' );
		define( 'WR_USER_FRONTEND_URL', plugins_url( '', WR_USER_FRONTEND_FILE ) );
		define( 'WR_USER_FRONTEND_ASSETS', WR_USER_FRONTEND_URL . '/assets' );
		define( 'WR_USER_FRONTEND_TEMPLATES', WR_USER_FRONTEND_PATH . '/templates' );

	}

	function includes() {
	    //Freemius
		include_once WR_USER_FRONTEND_INCLUDES . '/freemius.php';

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
		add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), [ $this, 'plugin_action_links' ] );
	}

	function localization_setup() {
		load_plugin_textdomain( 'wp-radio-user-frontend', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
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
