<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_Hooks {
	function __construct() {
		add_action( 'wp_radio_player_controls_tools_start', [ $this, 'favourite_btn' ] );
	}

	function favourite_btn( $id = false ) {
		$is_added = '';
		if ( $id ) {
			$favourites = get_user_meta( get_current_user_id(), 'favourite_stations', true );
			$is_added   = in_array( $id, $favourites ) ? 'added' : '';
		}

		?>
        <span class="add-favourite dashicons dashicons-heart <?php echo $is_added; ?>" title="Add to Favourite."></span>
	<?php }
}

new WR_User_Frontend_Hooks();
