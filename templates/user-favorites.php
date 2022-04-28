<?php

defined( 'ABSPATH' ) || exit();

$user_id = get_current_user_id();
$is_grid = 'grid' == wp_radio_get_settings( 'listing_view' );

$paginate = ! empty( $_GET['paginate'] ) ? intval( $_GET['paginate'] ) : 1;
$perpage = wp_radio_get_settings('posts_per_page', 10);

$user_favorites = (array) get_user_meta( get_current_user_id(), 'favourite_stations', true );
$favorites = array_slice( $user_favorites, ( $paginate - 1 ) * $perpage, $perpage );


?>

<?php if ( ! empty( $favorites ) ) { ?>
    <div class="wp-radio-favorites wp-radio-listings <?php echo $is_grid ? 'wp-radio-listing-grid' : ''; ?>">
		<?php
		foreach ( $favorites as $post_id ) {

			if ( 'wp_radio' != get_post_type($post_id ) ) {

                $new_favorites = array_diff( $user_favorites, [ $post_id ] );
				update_user_meta( $user_id, 'favourite_stations', $new_favorites );
				continue;
			}

			$station = wp_radio_get_station_data( $post_id );

			wp_radio_get_template( 'listing/loop', [ 'station' => $station, 'hide_desc' => 'yes', 'col' => 3 ] );
		}

        // Pagination
        if( count( $favorites ) >= $perpage ) {
	        wp_radio_get_template( 'listing/footer', [
		        'pageCount' => ceil( count( $user_favorites ) / $perpage ),
		        'paginate'  => $paginate,
	        ] );
        }

		?>

    </div>

<?php } else { ?>

    <p>You didn't add any station to your favorites.</p>
	<?php
}
