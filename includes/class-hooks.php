<?php

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'WR_User_Frontend_Hooks' ) ) {

	class WR_User_Frontend_Hooks {

		private static $instance = null;

		public function __construct() {
			add_action( 'wp_radio_player_controls_tools_start', [ $this, 'favourite_btn' ] );
			add_action( 'wp_radio/before_play_btn', [ $this, 'favourite_btn' ] );

			add_action( 'wp_radio_before_you_may_like', [ $this, 'review' ] );
			add_action( 'wp_footer', [ $this, 'player_templates' ], 99 );
			add_action( 'wp_radio_single_info', 'wp_radio_report_btn', 10, 2 );
			add_filter( 'comments_open', [ $this, 'enable_comment' ], 10, 2 );

			add_filter( 'wp_radio/settings_sections', [ $this, 'settings_sections' ] );

			//add general field settings
			add_filter( 'wp_radio/settings_fields', [ $this, 'settings_fields' ] );


			//add report button to player
			add_action( 'wp_radio_player_controls_tools_end', [ $this, 'player_controls_tools' ] );

			add_action( 'admin_action_view_station_submission', [ $this, 'view_station_submission' ] );
			add_action( 'pending_to_publish', [ $this, 'handle_station_approve' ] );
		}

		public function handle_station_approve( $post ) {

			if ( 'wp_radio' != get_post_type( $post ) ) {
				return;
			}

			$post_id = $post->ID;

			$user_id = wp_radio_get_meta( $post_id, 'submitted_by' );

			if ( empty( $user_id ) ) {
				return;
			}

			$user = get_userdata( $user_id );

			$user_email = $user->user_email;

			//send email notification
			$subject = esc_html__( 'Station submission has been approved:', 'wp-radio-user-frontend' );

			$template_args = array_filter( [
				'Station Name'    => get_the_title( $post_id ),
				'Country'         => ! empty( $country_name = get_term( intval( $_REQUEST['country'] ) )->name ) ? $country_name : '',
				'Contact Address' => wp_radio_get_meta( $post_id, 'address' ),
				'Contact Email'   => wp_radio_get_meta( $post_id, 'email' ),
				'Contact Phone'   => wp_radio_get_meta( $post_id, 'phone' ),
			] );


			ob_start();
			wp_radio_get_template( 'html-station-approve-email', [
				'post_id'   => $post_id,
				'args'      => $template_args,
				'user_name' => $user->display_name,
			], '', WR_USER_FRONTEND_TEMPLATES );
			$email_message = ob_get_clean();

			$headers = array( 'Content-Type: text/html; charset=UTF-8' );

			wp_mail( $user_email, $subject, $email_message, $headers );

		}

		public function view_station_submission() {
			if ( empty( $_REQUEST['id'] ) ) {
				return;
			}

			$post_id = intval( $_REQUEST['id'] );

			$type = ! empty( $_REQUEST['type'] ) ? $_REQUEST['type'] : '';

			if ( 'approve' == $type ) {
				wp_redirect(admin_url("post.php?post=$post_id&action=edit"));
				die;
			}

			wp_redirect( get_permalink( $post_id ) );
			die;


		}

		public function settings_sections( $sections ) {
			$inserted[] = array(
				'id'    => 'wp_radio_user_frontend_settings',
				'title' => sprintf( __( '%s User Frontend Settings', 'wp-radio-user-frontend' ), '<i class="dashicons dashicons-buddicons-buddypress-logo"></i>' ),
			);

			array_splice( $sections, 1, 0, $inserted );

			return $sections;
		}

		public function enable_comment( $open, $post_id ) {
			if ( ! is_singular( 'wp_radio' ) ) {
				return $open;
			}


			$enable_comment = 'on' == wp_radio_get_settings( 'enable_comment', 'on', 'wp_radio_user_frontend_settings' );
			if ( $enable_comment ) {
				$open = 'open';
			}

			return $open;

		}

		public function favourite_btn( $id = false ) {
			printf( '<button type="button" class="add-favourite dashicons dashicons-heart %1$s" aria-label="%2$s" title="%2$s"></button>',
				is_user_logged_in() ? '' : 'disabled',
				__( 'Add to Favorite.', 'wp-radio-user-frontend' )
			);
		}

		public function review( $post_id ) {
			wp_radio_get_template( 'reviews', [ 'post_id' => $post_id ], '', WR_USER_FRONTEND_TEMPLATES );
		}

		public function settings_fields( $settings ) {

			$settings['wp_radio_user_frontend_settings'][] = [
				'name'    => 'account_page',
				'label'   => __( 'User Account Page :', 'wp-radio-user-frontend' ),
				'desc'    => sprintf( __( 'Select the page for the user account page, where you place the %s shortcode.', 'wp-radio-user-frontend' ), '<strong>[wp_radio_my_account]</strong>' ),
				'type'    => 'pages',
			];

			$settings['wp_radio_user_frontend_settings'][] = [
				'name'      => 'submit_station_page',
				'label'   => __( 'Station Submission Page', 'wp-radio-user-frontend' ),
				'desc'    => sprintf( __( 'Select the page for station submission, where you place the %s shortcode.', 'wp-radio-user-frontend' ), '<strong>[wp_radio_submit_station]</strong>' ),
				'type'    => 'pages',
			];

			$settings['wp_radio_user_frontend_settings'][] = [
				'name'    => 'enable_comment',
				'label'   => __( 'Enable Comment :', 'wp-radio-user-frontend' ),
				'desc'    => __( 'Display comment form on the station page.', 'wp-radio-user-frontend' ),
				'type'    => 'switch',
				'default' => 'on',
			];

			$settings['wp_radio_user_frontend_settings'][] = [
				'name'    => 'enable_report',
				'label'   => __( 'Enable Report Submission :', 'wp-radio-user-frontend' ),
				'desc'    => __( 'Whether display the report button for user to report if any station doesn\'t work.', 'wp-radio-user-frontend' ),
				'type'    => 'switch',
				'default' => 'on',
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

			$post_id = 0;

			if ( 'popup' == $player_type ) {
				$post_id = intval( $_GET['station_id'] );
			}

			wp_radio_report_btn( false, $post_id, $player_type );
		}

		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

	}
}

WR_User_Frontend_Hooks::instance();
