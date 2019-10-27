<?php
/**
 * Plugin Name: WP Radio User Frontend
 * Plugin URI:  https://princeboss.com
 * Description: Let Engage Users to your website.
 * Version:     0.0.1
 * Author:      Prince
 * Author URI:  http://princeboss.com
 * Text Domain: user-frontend
 * Domain Path: /languages/
 */

// don't call the file directly
defined( 'ABSPATH' ) || exit();


/**
 * Main initiation class
 *
 * @since 1.0.0
 */
final class WR_User_Frontend {

	public $version = '0.0.1';

	private $min_php = '5.6.0';

	private $min_wp_radio = '2.0.4.5';

	private $name = 'WP Radio User Frontend';

	protected static $instance = null;

	public function __construct() {
		register_activation_hook( __FILE__, [ $this, 'install' ] );
		add_action( 'plugins_loaded', [ $this, 'let_the_journey_begin' ] );
	}

	function install() {
		include_once dirname( __FILE__ ) . '/includes/class-install.php';
		call_user_func( [ 'WR_User_Frontend_Install', 'activate' ] );
	}

	function let_the_journey_begin() {
		if ( $this->check_environment() ) {
			$this->define_constants();
			$this->includes();
			$this->init_hooks();
			do_action( 'wr_user_frontend_loaded' );
		}
	}

	function check_environment() {

		if ( version_compare( PHP_VERSION, $this->min_php, '<=' ) ) {
			deactivate_plugins( plugin_basename( __FILE__ ) );

			wp_die( "Unsupported PHP version Min required PHP Version:{$this->min_php}" );
		}

		// Check if Elementor installed and activated
		if ( ! did_action( 'wp_radio_loaded' ) ) {

			add_action( 'admin_notices', function () { ?>
                <div class="notice is-dismissible notice-error">
                    <p>
						<?php
						printf(
						/* translators: 1: Plugin name 2: Elementor */
							esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'elementor-addons-pack' ),
							'<strong>' . $this->name . '</strong>',
							'<strong>' . esc_html__( 'WP Radio', 'elementor-addons-pack' ) . '</strong>'
						);
						?>
                    </p>
                </div>
			<?php } );

			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			deactivate_plugins( plugin_basename( __FILE__ ) );

			return false;
		}

		return true;
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
		//core includes
		include_once WR_USER_FRONTEND_INCLUDES . '/class-form-handler.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/class-shortcode.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/class-hooks.php';
		include_once WR_USER_FRONTEND_INCLUDES . '/class-enqueue.php';
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
		add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'plugin_action_links' ) );
	}

	function localization_setup() {
		load_plugin_textdomain( 'wr-user-frontend', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

	function add_image_sizes() {
		add_image_size( 'wr_user_frontend_avatar_small', 32, 32, true );
		add_image_size( 'wr_user_frontend_avatar_large', 128, 128, true );
	}

	function plugin_action_links( $links ) {
		$links[] = '<a href="' . admin_url( '' ) . '">' . __( 'Settings', 'wp-portfolio-showcase' ) . '</a>';

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
	return WR_User_Frontend::instance();
}

wr_user_frontend();
