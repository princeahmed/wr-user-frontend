<?php

defined( 'ABSPATH' ) || exit();


class WR_User_Frontend_Hooks {

	private static $instance = null;

	public function __construct() {
		add_action( 'wp_radio/register_routes', [ $this, 'register_routes' ] );
		add_filter( 'comments_open', [ $this, 'enable_comment' ], 10, 2 );
		add_action( 'admin_action_view_station_submission', [ $this, 'view_station_submission' ] );
		add_action( 'pending_to_publish', [ $this, 'handle_station_approve' ] );

		add_action( 'wp_radio/single/footer/info/end', [ $this, 'display_report_btn' ] );
		add_action( 'wp_radio/single/contacts/before', [ $this, 'display_reviews' ] );
	}

	public function display_reviews() { ?>
        <div class="reviews-wrapper"></div>
	<?php }

	public function display_report_btn() {
		global $post;
		$post_id = $post->ID;
		$title   = get_the_title( $post_id );

		$data = [
			'post_id' => $post_id,
			'title'   => $title,
		];

		?>
        <div class="report-btn-wrap">
            <button type="button" class="report-btn"
                    onclick='window.wpRadioHooks.doAction("showReportModal", this, <?php echo json_encode( $data ); ?>)'>

                <svg width="26" height="26" aria-hidden="true" focusable="false" role="img"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
                </svg>
				<?php esc_html_e( 'Report a problem', 'wp-radio' ); ?>
            </button>
        </div>
	<?php }

	public function register_routes( $namespace ) {

		register_rest_route( $namespace, '/reviews/', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_reviews' ),
				'permission_callback' => '__return_true',
			),
		) );

		register_rest_route( $namespace, '/user-review/', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_user_review' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );

		register_rest_route( $namespace, '/favorites/', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_favorites' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );

		register_rest_route( $namespace, '/user-favorites/', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_favorite_items' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );

		register_rest_route( $namespace, '/report/', array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'handle_report' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );

		register_rest_route( $namespace, '/user-review/', array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_user_review' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );

		register_rest_route( $namespace, '/submit-station/', array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'handle_station_submission' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );

		register_rest_route( $namespace, '/update-account/', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'handle_update_account' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );

	}

	public function handle_update_account( $request ) {
		$data = json_decode( $request->get_body() );


		$user_id = get_current_user_id();

		$first_name = ! empty( $data->firstName ) ? sanitize_text_field( $data->firstName ) : '';
		$last_name  = ! empty( $data->lastName ) ? sanitize_text_field( $data->lastName ) : '';
		$email      = ! empty( $data->email ) ? sanitize_email( $data->email ) : '';

		$current_password = ! empty( $data->currentPass ) ? $data->currentPass : '';
		$new_password     = ! empty( $data->newPass ) ? $data->newPass : '';
		$confirm_password = ! empty( $data->confirmPass ) ? $data->confirmPass : '';
		$save_password    = true;

		// Current user data.
		$current_user = get_user_by( 'id', $user_id );

		// New user data.
		$user             = new stdClass();
		$user->ID         = $user_id;
		$user->first_name = $first_name;
		$user->last_name  = $last_name;

		// Handle required fields.
		$errors = [];

		$required_fields = [
			'firstName' => __( 'First name', 'wp-radio-user-frontend' ),
			'lastName'  => __( 'Last name', 'wp-radio-user-frontend' ),
			'email'     => __( 'Email address', 'wp-radio-user-frontend' ),
		];

		foreach ( $required_fields as $field_key => $field_name ) {
			if ( empty( $data->{$field_key} ) ) {
				$errors[] = sprintf( __( '%s is a required field.', 'wp-radio-user-frontend' ), '<strong>' . esc_html( $field_name ) . '</strong>' );
			}
		}

		if ( $email ) {
			$email = sanitize_email( $email );
			if ( ! is_email( $email ) ) {
				$errors[] = __( 'Please provide a valid email address.', 'wp-radio-user-frontend' );
			} elseif ( email_exists( $email ) && $email !== $current_user->user_email ) {
				$errors[] = __( 'This email address is already registered.', 'wp-radio-user-frontend' );
			}

			$user->user_email = $email;
		}

		if ( ! empty( $current_password ) && empty( $new_password ) && empty( $confirm_password ) ) {
			$errors[]      = __( 'Please fill out all password fields.', 'wp-radio-user-frontend' );
			$save_password = false;
		} elseif ( ! empty( $new_password ) && empty( $current_password ) ) {
			$error[]       = __( 'Please enter your current password.', 'wp-radio-user-frontend' );
			$save_password = false;
		} elseif ( ! empty( $new_password ) && empty( $confirm_password ) ) {
			$error[]       = __( 'Please re-enter your password.', 'wp-radio-user-frontend' );
			$save_password = false;
		} elseif ( ( ! empty( $new_password ) || ! empty( $confirm_password ) ) && $new_password !== $confirm_password ) {
			$error[]       = __( 'New passwords do not match.', 'wp-radio-user-frontend' );
			$save_password = false;
		} elseif ( ! empty( $new_password ) && ! wp_check_password( $current_password, $current_user->user_pass, $current_user->ID ) ) {
			$error[]       = __( 'Your current password is incorrect.', 'wp-radio-user-frontend' );
			$save_password = false;
		}

		if ( $new_password && $save_password ) {
			$user->user_pass = $new_password;
		}


		if ( empty( $errors ) ) {
			wp_update_user( $user );

			wp_send_json_success();
		}

		wp_send_json_error( $errors );

	}

	public function handle_station_submission( $request ) {
		$data = $_REQUEST;

		$args = [
			'post_status' => 'pending',
			'post_type'   => 'wp_radio',
		];

		$args['post_title']   = ! empty( $data['title'] ) ? sanitize_text_field( $data['title'] ) : '';
		$args['post_content'] = ! empty( $data['content'] ) ? sanitize_textarea_field( $data['content'] ) : '';

		$tax = [
			'radio_country' => ! empty( $data['country'] ) ? sanitize_key( $data['country'] ) : '',
			'radio_genre'   => ! empty( $data['genre'] ) ? array_map( 'intval', explode( ',', $data['genre'] ) ) : '',
		];

		if ( ! empty( $_FILES['logo'] ) && empty( $_FILES['logo']['error'] ) ) {

			$type = wp_check_filetype( $_FILES['logo']['name'] );

			if ( in_array( $type['type'], [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif' ] ) ) {
				$image_id = wp_radio_upload_file_image( $_FILES['logo'] );
			}
		}

		$meta = [
			'slogan'       => ! empty( $data['slogan'] ) ? sanitize_text_field( $data['slogan'] ) : '',
			'stream_url'   => ! empty( $data['stream_url'] ) ? esc_url( $data['stream_url'] ) : '',
			'website'      => ! empty( $data['website'] ) ? esc_url( $data['website'] ) : '',
			'facebook'     => ! empty( $data['facebook'] ) ? esc_url( $data['facebook'] ) : '',
			'twitter'      => ! empty( $data['twitter'] ) ? esc_url( $data['twitter'] ) : '',
			'address'      => ! empty( $data['address'] ) ? sanitize_textarea_field( $data['address'] ) : '',
			'email'        => ! empty( $data['email'] ) ? sanitize_email( $data['email'] ) : '',
			'phone'        => ! empty( $data['phone'] ) ? sanitize_text_field( $data['phone'] ) : '',
			'logo'         => ! empty( $image_id ) ? wp_get_attachment_url( $image_id ) : '',
			'submitted_by' => get_current_user_id(),
		];

		// Handle required fields.
		$errors = [];

		$required_fields = [
			'title'      => __( 'Title', 'wp-radio-user-frontend' ),
			'content'    => __( 'Description', 'wp-radio-user-frontend' ),
			'country'    => __( 'Country', 'wp-radio-user-frontend' ),
			'stream_url' => __( 'Stream URL', 'wp-radio-user-frontend' ),
			'email'      => __( 'Email', 'wp-radio-user-frontend' ),
		];

		foreach ( $required_fields as $field_key => $field_name ) {
			if ( empty( $data[ $field_key ] ) ) {
				$errors[] = sprintf( __( '%s is a required field.', 'wp-radio-user-frontend' ), '<strong>' . $field_name . '</strong>' );
			}
		}

		if ( ! empty( $errors ) ) {
			wp_send_json_error( $errors );
		}

		$post_id = wp_insert_post( $args );

		if ( ! is_wp_error( $post_id ) ) {
			foreach ( $meta as $key => $value ) {
				update_post_meta( $post_id, $key, $value );
			}

			foreach ( $tax as $taxonomy => $terms ) {
				wp_set_object_terms( $post_id, $terms, $taxonomy );
			}

			//send email notification
			$subject = esc_html__( 'New Radio Station Submission', 'wp-radio-user-frontend' );

			$to = wp_radio_get_settings( 'notification_email', get_option( 'admin_email' ) );


			$template_args = array_filter( [
				'Station Name'    => $data['title'],
				'Contact Address' => $data['address'],
				'Contact Email'   => $data['email'],
				'Contact Phone'   => $data['phone'],
			] );


			$user = get_user_by( 'email', $to );

			ob_start();
			wp_radio_get_template( 'html-station-submit-email', [
				'post_id'   => $post_id,
				'args'      => $template_args,
				'user_name' => $user->data->display_name,
			], '', WR_USER_FRONTEND_TEMPLATES );
			$email_message = ob_get_clean();

			$headers = array( 'Content-Type: text/html; charset=UTF-8' );

			wp_mail( $to, $subject, $email_message, $headers );

			wp_send_json_success();
		}

	}

	public function update_user_review( $request ) {
		$post_id = intval( $request->get_param( 'post_id' ) );
		$data    = json_decode( $request->get_body() );

		if ( empty( $data->rating ) || empty( $data->content ) ) {
			wp_send_json_error( __( 'Missing Require Field(s)', 'wp-radio-user-frontend' ) );
		}

		$meta_input = [
			'object_id' => $post_id,
			'user_id'   => get_current_user_id(),
			'rating'    => intval( $data->rating ),
		];

		$exits = get_page_by_title( md5( $post_id . get_current_user_id() ), OBJECT, 'radio_review' );

		if ( ! empty( $exits ) ) {
			$review_id = wp_update_post( [
				'ID'           => $exits->ID,
				'post_content' => sanitize_textarea_field( $data->content ),
				'meta_input'   => $meta_input
			] );
		} else {
			$review_id = wp_insert_post( [
				'post_title'   => md5( $post_id . get_current_user_id() ),
				'post_content' => sanitize_textarea_field( $data->content ),
				'post_type'    => 'radio_review',
				'post_status'  => 'publish',
				'meta_input'   => $meta_input
			] );
		}


		if ( is_wp_error( $review_id ) ) {
			wp_send_json_error( $review_id );
		}


		wp_send_json_success();
	}

	public function get_reviews( $request ) {
		$post_id = intval( $request->get_param( 'post_id' ) );

		$reviews = get_posts( [
			'post_type'   => 'radio_review',
			'meta_key'    => 'object_id',
			'meta_value'  => $post_id,
			'numberposts' => 10,
		] );

		$items = [];

		if ( ! empty( $reviews ) ) {
			$item = [];

			foreach ( $reviews as $review ) {
				$review_id = $review->ID;

				$item['object_id'] = get_post_meta( $review_id, 'object_id', true );
				$item['rating']    = get_post_meta( $review_id, 'rating', true );

				$user_id = get_post_meta( $review_id, 'user_id', true );
				$user    = get_user_by( 'id', $user_id );

				$item['avatar']  = get_avatar( $user_id, 32 );
				$item['name']    = $user->first_name . ' ' . $user->last_name;
				$item['date']    = get_the_date( '', $review_id );
				$item['content'] = get_post_field( 'post_content', $review_id );

				$items[] = $item;
			}
		}

		wp_send_json_success( $items );
	}

	public function get_user_review( $request ) {
		$station_id = intval( $request->get_param( 'post_id' ) );

		$hash  = md5( $station_id . get_current_user_id() );
		$exits = get_page_by_title( $hash, OBJECT, 'radio_review' );

		$rating = ! empty( $exits ) ? get_post_meta( $exits->ID, 'rating', 1 ) : 0;

		wp_send_json_success( [
			'rating'  => $rating,
			'content' => $exits ? get_post_field( 'post_content', $exits->ID ) : ''
		] );

	}

	public function handle_report( $request ) {
		$data = json_decode( $request->get_body() );

		$email      = ! empty( $data->email ) ? sanitize_email( $data->email ) : '';
		$issue      = ! empty( $data->issue ) ? sanitize_text_field( $data->issue ) : '';
		$message    = ! empty( $data->message ) ? sanitize_textarea_field( $data->message ) : '';
		$station_id = ! empty( $data->id ) ? intval( $data->id ) : '';

		// Handle required fields.
		$errors = [];

		$required_fields = [
			'email'   => __( 'Email', 'wp-radio-user-frontend' ),
			'issue'   => __( 'Issue', 'wp-radio-user-frontend' ),
			'message' => __( 'Message', 'wp-radio-user-frontend' ),
		];

		foreach ( $required_fields as $field_key => $field_name ) {
			if ( empty( $data->{$field_key} ) ) {
				$errors[] = sprintf( __( '%s is a required field.', 'wp-radio-user-frontend' ), '<strong>' . $field_name . '</strong>' );
			}
		}

		if ( ! empty( $errors ) ) {
			wp_send_json_error( $errors );
		}

		$subject = sprintf( esc_html__( 'New Report submitted for %s Station', 'wp-radio-user-frontend' ), get_the_title( $station_id ) );

		$to = wp_radio_get_settings( 'notification_email', get_option( 'admin_email' ) );

		ob_start();

		wp_radio_get_template( 'html-report-email', [
			'email'      => $email,
			'issue'      => $issue,
			'message'    => $message,
			'station_id' => $station_id,
		], '', WR_USER_FRONTEND_TEMPLATES );

		$email_message = ob_get_clean();

		$headers = array( 'Content-Type: text/html; charset=UTF-8' );

		wp_mail( $to, $subject, $email_message, $headers );

		wp_send_json_success( true );
	}

	public function get_favorites( $request ) {
		$post_id = intval( $request->get_param( 'post_id' ) );
		$action  = sanitize_key( $request->get_param( 'action' ) );
		$user_id = get_current_user_id();

		$favorites = (array) get_user_meta( $user_id, 'favourite_stations', true );

		if ( 'add' == $action ) {
			$favorites = array_merge( $favorites, [ $post_id ] );
		} else {
			if ( ( $key = array_search( $post_id, $favorites ) ) !== false ) {
				unset( $favorites[ $key ] );
			}
		}

		$favorites = array_unique( $favorites );

		update_user_meta( $user_id, 'favourite_stations', $favorites );
		wp_send_json_success( $favorites );

	}

	public function get_favorite_items( $request ) {
		$paged = intval( $request->get_param( 'paginate' ) );

		wp_send_json_success( wr_user_frontend_get_favorite_items( $paged ) );
	}

	//backlog
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
