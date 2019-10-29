<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Hooks {
	function __construct() {
		add_action( 'wp_radio_player_controls_tools_start', [ $this, 'favourite_btn' ] );
		add_action( 'wp_radio_before_you_may_like', [ $this, 'review' ] );
		add_filter( 'wp_radio_settings', [ $this, 'settings' ] );
	}

	function favourite_btn( $id = false ) { ?>
        <span class="add-favourite dashicons dashicons-heart <?php echo is_user_logged_in() ? '' : 'disabled'; ?>" title="Add to Favourite."></span>
	<?php }

	function review( $post_id ) {
		wp_radio_get_template( 'reviews', [ 'post_id' => $post_id ], '', WR_USER_FRONTEND_TEMPLATES );
	}

	function settings( $settings ) {
		$settings[] = [
			'id'      => 'account_page',
			'label'   => __( 'Account Page', 'wp-radio' ),
			'desc'    => sprintf( __( 'Select the page for the user account page, where you place the %s shortcode.', 'wp-radio' ), '<strong>[wp_radio_my_account]</strong>' ),
			'std'     => get_option( 'wp_radio_account_page' ),
			'type'    => 'page-select',
			'section' => 'page'
		];

		$settings[] = [
			'id'      => 'submit_station_page',
			'label'   => __( 'Station Submission Page', 'wp-radio' ),
			'desc'    => sprintf( __( 'Select the page for station submission, where you place the %s shortcode.', 'wp-radio' ), '<strong>[wp_radio_submit_station]</strong>' ),
			'std'     => get_option( 'wp_radio_submit_station_page' ),
			'type'    => 'page-select',
			'section' => 'page'
		];

		return $settings;

	}

}

new WR_User_Frontend_Hooks();
