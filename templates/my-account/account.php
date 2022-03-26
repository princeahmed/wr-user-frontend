<?php

defined( 'ABSPATH' ) || exit();

$favorites  = wr_user_frontend_get_favorite_items();
$page_count = wr_user_frontend_get_favorite_items( 1, true );

$user        = wr_user_frontend_get_user_data();
$submit_page = wp_radio_get_settings( 'submit_station_page' );;

?>

<div id="wp-radio-account"
     data-pagecount="<?php echo $page_count; ?>"
     data-favorites='<?php echo json_encode( $favorites ); ?>'
     data-user='<?php echo json_encode( $user ); ?>'
     data-logoutURL='<?php echo wp_logout_url( '/' ) ?>'
     data-submitURL='<?php echo get_the_permalink( $submit_page ); ?>'
>
</div>
