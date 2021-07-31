<?php

defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'WR_User_Frontend_Hooks' ) ) {

	class WR_User_Frontend_Hooks {

		private static $instance = null;

		public function __construct() {
			add_action( 'wp_radio/register_routes', [ $this, 'register_routes' ] );


			//backlog
			//add_action( 'wp_radio_player_controls_tools_start', [ $this, 'favourite_btn' ] );
			//add_action( 'wp_radio/before_play_btn', [ $this, 'favourite_btn' ] );
			//add_action( 'wp_radio_before_you_may_like', [ $this, 'review' ] );
			//add_action( 'wp_footer', [ $this, 'player_templates' ], 99 );
			//add_action( 'wp_radio_single_info', 'wp_radio_report_btn', 10, 2 );
			//add_action( 'wp_radio_player_controls_tools_end', [ $this, 'player_controls_tools' ] );

			add_filter( 'comments_open', [ $this, 'enable_comment' ], 10, 2 );
			add_filter( 'wp_radio/settings_sections', [ $this, 'settings_sections' ] );
			add_filter( 'wp_radio/settings_fields', [ $this, 'settings_fields' ] );
			add_action( 'admin_action_view_station_submission', [ $this, 'view_station_submission' ] );
			add_action( 'pending_to_publish', [ $this, 'handle_station_approve' ] );
		}

		public function register_routes( $namespace ) {

			register_rest_route( $namespace, '/reviews/', array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_reviews' ),
					'permission_callback' => 'is_user_logged_in',
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

			$args['tax_input'] = [
				'radio_country' => ! empty( $data['country'] ) ? sanitize_key( $data['country'] ) : '',
				'radio_genre'   => ! empty( $data['genre'] ) ? array_map( 'intval', explode( ',', $data['genre'] ) ) : '',
			];

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

			if ( ! empty( $_FILES['logo'] ) && empty( $_FILES['logo']['error'] ) ) {

				$type = wp_check_filetype( $_FILES['logo']['name'] );

				if ( in_array( $type['type'], [ 'image/png', 'image/jpg', 'image/jpeg', 'image/gif' ] ) ) {
					$image_id = wp_radio_upload_file_image( $_FILES['logo'] );
				}
			}

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

				//send email notification
				$subject = esc_html__( 'New Radio Station Submission', 'wp-radio-user-frontend' );

				$to = wp_radio_get_settings( 'notification_email', get_option( 'admin_email' ), 'wp_radio_user_frontend_settings' );

				$country_term = get_term_by( 'slug', sanitize_key( $data['country'] ) );

				$template_args = array_filter( [
					'Station Name'    => $data['title'],
					'Country'         => ! empty( $country_term ) && ! is_wp_error( $country_term ) ? $country_term->name : '',
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

			if ( empty( $email ) || empty( $issue ) ) {
				wp_send_json_error( [ 'type' => 'empty' ] );
			}

			$subject = sprintf( esc_html__( 'New Report submitted for %s Station', 'wp-radio-user-frontend' ), get_the_title( $station_id ) );

			$to = wp_radio_get_settings( 'notification_email', get_option( 'admin_email' ), 'wp_radio_user_frontend_settings' );

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

			$favourites = (array) get_user_meta( $user_id, 'favourite_stations', true );

			if ( 'add' == $action ) {
				$favourites = array_merge( $favourites, [ $post_id ] );
			} else {
				if ( ( $key = array_search( $post_id, $favourites ) ) !== false ) {
					unset( $favourites[ $key ] );
				}
			}

			$favourites = array_unique( $favourites );

			update_user_meta( $user_id, 'favourite_stations', $favourites );
			wp_send_json_success( $favourites );

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
				'name'  => 'account_page',
				'label' => __( 'User Account Page :', 'wp-radio-user-frontend' ),
				'desc'  => sprintf( __( 'Select the page for the user account page, where you place the %s shortcode.', 'wp-radio-user-frontend' ), '<strong>[wp_radio_my_account]</strong>' ),
				'type'  => 'pages',
			];

			$settings['wp_radio_user_frontend_settings'][] = [
				'name'  => 'submit_station_page',
				'label' => __( 'Station Submission Page', 'wp-radio-user-frontend' ),
				'desc'  => sprintf( __( 'Select the page for station submission, where you place the %s shortcode.', 'wp-radio-user-frontend' ), '<strong>[wp_radio_submit_station]</strong>' ),
				'type'  => 'pages',
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
