<?php

defined( 'ABSPATH' ) || exit();

$favourites = get_user_meta( get_current_user_id(), 'favourite_stations', true );
$is_grid    = 'grid' == prince_get_option( 'listing_view' );

$favourites = array_slice( $favourites, 0, 15 );

?>
    <h1>Favourite Stations</h1>
<?php if ( ! empty( $favourites ) ) { ?>
    <div class="wp-radio-favourites wp-radio-listings <?php echo $is_grid ? 'wp-radio-listing-grid' : ''; ?>">
		<?php
		foreach ( $favourites as $post_id ) {
			$station = get_post( $post_id );
			wp_radio_get_template( 'listing/loop', [ 'station' => $station ] );
		}
		?>
    </div>

    <p class="load-more">
        <button class="button">Load More</button>
    </p>

<?php } else { ?>
    <p>You didn't add any station to your favourites.</p>
<?php
}
