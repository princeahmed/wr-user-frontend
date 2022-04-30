<?php

defined( 'ABSPATH' ) || exit();

$user_id = get_current_user_id();
$is_grid = 'grid' == wp_radio_get_settings( 'listing_view' );

$paginate = ! empty( $_GET['paginate'] ) ? intval( $_GET['paginate'] ) : 1;
$perpage  = wp_radio_get_settings( 'posts_per_page', 10 );

$user_favorites = (array) get_user_meta( get_current_user_id(), 'favourite_stations', true );
$favorites      = array_slice( $user_favorites, ( $paginate - 1 ) * $perpage, $perpage );

?>

<?php if ( ! empty( $favorites ) ) { ?>
    <div class="wp-radio-favorites wp-radio-listings">
        <div class="wp-radio-listing-wrap <?php echo $is_grid ? 'wp-radio-listing-grid' : ''; ?>">
			<?php
			foreach ( $favorites as $post_id ) {

				if ( 'wp_radio' != get_post_type( $post_id ) ) {

					$new_favorites = array_diff( $user_favorites, [ $post_id ] );
					update_user_meta( $user_id, 'favourite_stations', $new_favorites );
					continue;
				}

				$station      = wp_radio_get_station_data( $post_id );
				$is_grid      = 'grid' == wp_radio_get_settings( 'listing_view', 'list' );
				$col          = wp_radio_get_settings( 'grid_column', 4 );
				$show_genres  = ! $is_grid && wp_radio_get_settings( 'listing_genre', true );
				$show_content = ! $is_grid && wp_radio_get_settings( 'listing_content', false );

				wp_radio_get_template( 'listing/loop', [
					'station'      => $station,
					'is_grid'      => $is_grid,
					'show_genres'  => $show_genres,
					'show_content' => $show_content,
				] );
			}

			// Pagination
			if ( count( $favorites ) >= $perpage ) {
				wp_radio_get_template( 'listing/footer', [
					'pageCount' => ceil( count( $user_favorites ) / $perpage ),
					'paginate'  => $paginate,
				] );
			}

			?>

        </div>
    </div>

<?php } else { ?>

    <p>You didn't add any station to your favorites.</p>
	<?php
}
