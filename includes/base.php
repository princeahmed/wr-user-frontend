<?php

defined('ABSPATH') || exit();

final class WP_Radio_User_Frontend {


	public $min_wp_radio = '2.0.8';

	public $name = 'WP Radio User Frontend';

	protected static $instance = null;

	public function __construct() {

		if ( $this->check_environment() ) {
			$this->includes();
			$this->init_hooks();
			do_action( 'wp_radio_user_frontend_loaded' );
		}
	}

	function check_environment() {

		$return = true;

		// Check if WP Radio installed and activated
		if ( ! did_action( 'wp_radio_loaded' ) ) {
			$return = false;

			$notice = sprintf(
			/* translators: 1: Plugin name 2: WP Radio */ esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'wp-radio-user-frontend' ),
				'<strong>' . $this->name . '</strong>', '<strong>' . esc_html__( 'WP Radio', 'wp-radio-user-frontend' ) . '</strong>'
			);

		}

		//check min WP Radio version
		if ( defined('WP_RADIO_VERSION') && version_compare( WP_RADIO_VERSION, $this->min_wp_radio, '<' ) ) {
			$return = false;

			$notice = sprintf(
			/* translators: 1: Plugin name 2: WP Radio 3: Required WP Radio version */ esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.',
				'wp-radio-user-frontend' ),
				'<strong>' . $this->name . '</strong>', '<strong>' . esc_html__( 'WP Radio', 'wp-radio-user-frontend' ) . '</strong>',
				$this->min_wp_radio
			);
		}

		if ( ! $return ) {

			add_action( 'admin_notices', function () use ( $notice ) { ?>
				<div class="notice is-dismissible notice-error">
					<p><?php echo $notice; ?></p>
				</div>
			<?php } );

			return $return;
		} else {
			return $return;
		}

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

add_action('plugins_loaded', 'wr_user_frontend', 11);