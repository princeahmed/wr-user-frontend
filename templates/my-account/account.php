<?php

defined( 'ABSPATH' ) || exit();

$favorites = wr_user_frontend_get_favorite_items();

$user = wr_user_frontend_get_user_data();

?>

<div id="wp-radio-account"
     data-favorites='<?php echo wp_radio_escape_quote( json_encode( $favorites ) ); ?>'
     data-user='<?php echo wp_radio_escape_quote( json_encode( $user ) ); ?>'
     data-logoutURL='<?php echo wp_logout_url() ?>'>
</div>
