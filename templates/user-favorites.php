<?php

defined( 'ABSPATH' ) || exit();

$is_grid = 'grid' == wp_radio_get_settings( 'listing_view', '', 'wp_radio_display_settings' );

$favorites = wr_user_frontend_get_favorites();

?>

<?php if ( ! empty( $favorites ) ) { ?>
    <div class="wp-radio-favorites wp-radio-listings <?php echo $is_grid ? 'wp-radio-listing-grid' : ''; ?>">
		<?php
		foreach ( $favorites as $post_id ) {

			if ( 'wp_radio' != get_post_type($post_id ) ) {
				continue;
			}

			$station = get_post( $post_id );
			wp_radio_get_template( 'listing/loop', [ 'station' => $station, 'hide_desc' => 'yes', 'col' => 3 ] );
		}
		?>
    </div>

	<?php if ( wr_user_frontend_get_favorites( 0, '', true ) >= 15 ) { ?>
        <p class="load-more">
            <button class="button load-more-favorites" id="load_more_favorites" data-offset="15">
                <img src="<?php echo site_url( 'wp-includes/images/wpspin.gif' ); ?>" alt="Loading..."> Load More Favorites
            </button>
        </p>
	<?php } ?>

<?php } else { ?>

    <p>You didn't add any station to your favorites.</p>
	<?php
}
