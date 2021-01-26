<?php

defined( 'ABSPATH' ) || exit();

$is_grid = 'grid' == wp_radio_get_settings( 'listing_view', '', 'wp_radio_display_settings' );

$favourites = wr_user_frontend_get_favourites();

?>
    <h3 class="section-title">Favorite Stations</h3>
<?php if ( ! empty( $favourites ) ) { ?>
    <div class="wp-radio-favourites wp-radio-listings <?php echo $is_grid ? 'wp-radio-listing-grid' : ''; ?>">
		<?php
		foreach ( $favourites as $post_id ) {
			$station = get_post( $post_id );

			if(!$station){
			    continue;
            }

			wp_radio_get_template( 'listing/loop', [ 'station' => $station, 'hide_desc' => 'yes', 'col' => 3 ] );
		}
		?>
    </div>

	<?php if ( wr_user_frontend_get_favourites( 0, '', true ) >= 15 ) { ?>
        <p class="load-more">
            <button class="button load-more-favourites" id="load_more_favourites" data-offset="15">
                <img src="<?php echo site_url( 'wp-includes/images/wpspin.gif' ); ?>" alt="Loading..."> Load More Favorites
            </button>
        </p>
	<?php } ?>

<?php } else { ?>

    <p>You didn't add any station to your favourites.</p>
	<?php
}
