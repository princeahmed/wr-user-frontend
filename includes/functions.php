<?php

defined( 'ABSPATH' ) || exit();

if ( ! function_exists( 'wp_radio_create_new_listener' ) ) {
	function wp_radio_create_new_listener( $email, $username = '', $password = '', $args = array() ) {
		if ( empty( $email ) || ! is_email( $email ) ) {
			return new WP_Error( 'registration-error-invalid-email', __( 'Please provide a valid email address.', 'wp-radio-user-frontend' ) );
		}

		if ( email_exists( $email ) ) {
			return new WP_Error( 'registration-error-email-exists', apply_filters( 'woocommerce_registration_error_email_exists', __( 'An account is already registered with your email address. Please log in.', 'wp-radio-user-frontend' ), $email ) );
		}

		$username = sanitize_user( $username );

		if ( empty( $username ) || ! validate_username( $username ) ) {
			return new WP_Error( 'registration-error-invalid-username', __( 'Please enter a valid account username.', 'wp-radio-user-frontend' ) );
		}

		if ( username_exists( $username ) ) {
			return new WP_Error( 'registration-error-username-exists', __( 'An account is already registered with that username. Please choose another.', 'wp-radio-user-frontend' ) );
		}

		if ( empty( $password ) ) {
			return new WP_Error( 'registration-error-missing-password', __( 'Please enter an account password.', 'wp-radio-user-frontend' ) );
		}

		// Use WP_Error to handle registration errors.
		$errors = new WP_Error();

		if ( $errors->get_error_code() ) {
			return $errors;
		}

		$new_listener_data = array(
			'user_login' => $username,
			'user_pass'  => $password,
			'user_email' => $email,
			'role'       => 'listener',
		);

		$listener_id = wp_insert_user( $new_listener_data );

		update_user_meta( $listener_id, 'first_name', $args['first_name'] );
		update_user_meta( $listener_id, 'last_name', $args['last_name'] );

		if ( is_wp_error( $listener_id ) ) {
			return $listener_id;
		}

		return $listener_id;
	}
}

if(!function_exists('wr_user_frontend_get_favourites')) {
	function wr_user_frontend_get_favourites( $offset = 0, $limit = 15, $count = false ) {
		$favourites = get_user_meta( get_current_user_id(), 'favourite_stations', true );

		if ( $count ) {
			return count( $favourites );
		}

		if ( empty( $favourites ) ) {
			return false;
		}

		$favourites = array_slice( $favourites, $offset, $offset + $limit );

		return ! empty( $favourites ) ? array_unique( $favourites ) : false;
	}
}

if ( ! function_exists( 'wp_radio_report_btn' ) ) {
	function wp_radio_report_btn( $label = 0, $post_id = 0, $player_type = false ) {

		if ( 'on' != wp_radio_get_settings( 'enable_report', 'on', 'wp_radio_user_frontend_settings' ) ) {
			return;
		}

		$data_attr = $post_id ? sprintf( 'data-name="%1$s" data-id="%2$s"', get_the_title( $post_id ), $post_id ) : '';

		$popup_class = '';
		if ( 'popup' == $player_type ) {
			$popup_class = 'open-in-parent';
			$data_attr   .= sprintf( 'data-url="%1$s"', add_query_arg( 'report_station_id', $post_id, get_the_permalink( $post_id ) ) );
		}

		?>

        <button type="button" title="<?php _e( 'Report', 'wp-radio-user-frontend' ); ?>" aria-label="<?php _e( 'Report',
			'wp-radio-user-frontend' ); ?>" class="report-btn open-popup <?php echo $popup_class; ?>" <?php echo $data_attr; ?>>
            <i class="dashicons dashicons-warning"> </i>
			<?php echo $label ? __( 'Report a Problem', 'wp-radio-user-frontend' ) : ''; ?>
        </button>
		<?php
	}
}