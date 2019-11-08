<?php

defined( 'ABSPATH' ) || exit();

$is_grid = 'grid' == prince_get_option( 'listing_view' );

$favourites = wr_user_frontend_get_favourites();
?>
    <h3 class="section-title">Favorite Stations</h3>
<?php if ( ! empty( $favourites ) ) { ?>
    <div class="wp-radio-favourites wp-radio-listings <?php echo $is_grid ? 'wp-radio-listing-grid' : ''; ?>">
		<?php
		foreach ( $favourites as $post_id ) {
			$station = get_post( $post_id );
			wp_radio_get_template( 'listing/loop', [ 'station' => $station, 'hide_desc' => 'yes' ] );
		}
		?>
    </div>

	<?php if ( count( $favourites ) > 15 ) { ?>
        <p class="load-more">
            <button class="button load-more-favourites" id="load_more_favourites" data-offset="15">Load More</button>
        </p>
	<?php } ?>

<?php } else { ?>

    <p>You didn't add any station to your favourites.</p>
	<?php
}
