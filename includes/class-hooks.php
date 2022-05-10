<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Hooks {

	private static $instance = null;

	public function __construct() {

		add_filter( 'comments_open', [ $this, 'enable_comment' ], 10, 2 );

		add_action( 'admin_action_view_station_submission', [ $this, 'view_station_submission' ] );
		add_action( 'pending_to_publish', [ $this, 'handle_station_approve' ] );

		// Render favorite button
		add_action( 'wp_radio/play_btn/before', [ $this, 'render_favorite_btn' ] );

		add_action( 'wp_radio/player/controls/start', [ $this, 'render_favorite_btn' ] );

		// Render reviews
		if ( wp_radio_get_settings( 'enable_reviews', true ) ) {
			add_action( 'wp_radio/single/playlist/after', [ $this, 'render_reviews' ] );
		}

		if ( wp_radio_get_settings( 'enable_report', true ) ) {
			add_action( 'wp_radio/player/controls/end', [ $this, 'render_report_btn' ] );
			add_action( 'wp_radio/single/footer/info/end', [ $this, 'render_report_btn' ] );
		}

	}

	public function render_favorite_btn( $id ) { ?>
        <button type="button" class="favorite-btn" data-id="<?php echo $id; ?>">
            <i class="dashicons dashicons-heart"></i>
        </button>
	<?php }

	public function render_reviews( $id ) {
		wp_radio_get_template( 'reviews', [ 'id' => $id ], '', WR_USER_FRONTEND_TEMPLATES );
	}

	public function render_report_btn( $id ) { ?>
        <button type="button" class="report-btn wp-radio-button"
                data-station='<?php echo json_encode( wp_radio_get_stream_data( $id ) ); ?>'
        >
            <i class="dashicons dashicons-warning"></i>
            <span><?php esc_html_e( 'Report a problem', 'wp-radio-user-frontend' ); ?></span>
        </button>
	<?php }

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
			wp_redirect( admin_url( "post.php?post=$post_id&action=edit" ) );
			die;
		}

		wp_redirect( get_permalink( $post_id ) );
		die;


	}

	public function enable_comment( $open, $post_id ) {
		if ( ! is_singular( 'wp_radio' ) ) {
			return $open;
		}


		$enable_comment = wp_radio_get_settings( 'enable_comment', true );
		if ( $enable_comment ) {
			$open = 'open';
		}

		return $open;

	}

	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

}

WR_User_Frontend_Hooks::instance();
