<?php

defined( 'ABSPATH' ) || exit();

$user_login = wp_get_current_user()->data->user_login;


?>

<p>Hello <strong><?php echo $user_login; ?></strong> (not <strong><?php echo $user_login; ?></strong>?
    <a href="<?php echo wp_logout_url( get_the_permalink( wp_radio_get_settings( 'account_page', get_option( 'wp_radio_account_page' ) ) ) ); ?>">Log
        out</a>)</p>

<p>From your account dashboard you can view your recent
    <a href="#" class="to-favourites" data-target=".content-favourites">favourite stations</a>,
    and <a href="#" class="to-edit-account" data-target=".content-edit-account">edit your password and account
        details</a>.</p>
