<?php

defined( 'ABSPATH' ) || exit();

?>

<p>Hello <strong>prince</strong> (not <strong>prince</strong>?
    <a href="<?php echo wp_logout_url( get_the_permalink( prince_get_option( 'account_page', get_option( 'wp_radio_account_page' ) ) ) ); ?>">Log out</a>)</p>

<p>From your account dashboard you can view your recent
    <a href="#" class="to-favourites" data-target=".content-favourites">favourite stations</a>,
    and <a href="#" class="to-edit-account" data-target=".content-edit-account">edit your password and account
        details</a>.</p>
