<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Hooks {
	function __construct() {
		add_action( 'wp_radio_player_controls_tools_start', [ $this, 'favourite_btn' ] );
		add_action( 'wp_radio_before_you_may_like', [ $this, 'review' ] );
		add_filter( 'wp_radio_settings', [ $this, 'settings' ] );
		add_action( 'wp_footer', [ $this, 'player_templates' ], 99 );
		add_action( 'wp_radio_player_controls_tools_end', [$this, 'player_controls_tools'] );
		add_action( 'wp_radio_single_info', 'wp_radio_report_btn', 10, 2 );
	}

	public function favourite_btn( $id = false ) {
		printf(
			'<span class="add-favourite dashicons dashicons-heart %1$s" title="%2$s"></span>',
			is_user_logged_in() ? '' : 'disabled',
			__( 'Add to Favorite.', 'wp-radio-user-frontend' )
		);
	}

	public function review( $post_id ) {
		wp_radio_get_template( 'reviews', [ 'post_id' => $post_id ], '', WR_USER_FRONTEND_TEMPLATES );
	}

	public function settings( $settings ) {
		$settings[] = [
			'id'      => 'account_page',
			'label'   => __( 'Account Page', 'wp-radio-user-frontend' ),
			'desc'    => sprintf( __( 'Select the page for the user account page, where you place the %s shortcode.', 'wp-radio-user-frontend' ), '<strong>[wp_radio_my_account]</strong>' ),
			'std'     => get_option( 'wp_radio_account_page' ),
			'type'    => 'page-select',
			'section' => 'page'
		];

		$settings[] = [
			'id'      => 'submit_station_page',
			'label'   => __( 'Station Submission Page', 'wp-radio-user-frontend' ),
			'desc'    => sprintf( __( 'Select the page for station submission, where you place the %s shortcode.', 'wp-radio-user-frontend' ), '<strong>[wp_radio_submit_station]</strong>' ),
			'std'     => get_option( 'wp_radio_submit_station_page' ),
			'type'    => 'page-select',
			'section' => 'page'
		];

		return $settings;

	}

	public function player_templates() {

		//load report form if not popup window
		if ( empty( $_GET['player'] ) || 'popup' != $_GET['player'] ) {
			wp_radio_get_template( 'html-report-form', [], '', WR_USER_FRONTEND_TEMPLATES );
		}

	}

	public function player_controls_tools( $player_type ) {

		$post_id =  0;

		if('popup' == $player_type){
			$post_id =  intval( $_GET['station_id'] );
		}

		wp_radio_report_btn( false, $post_id, $player_type );
	}

}

new WR_User_Frontend_Hooks();
