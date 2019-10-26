<?php

defined( 'ABSPATH' ) || exit();


$items = array(
	'dashboard'       => __( 'Dashboard', 'wp-radio' ),
	'favourites'      => __( 'Favourites', 'wp-radio' ),
	'edit-account'    => __( 'Account details', 'wp-radio' ),
	//'listener-logout' => __( 'Logout', 'wp-radio' ),
);
?>

<nav class="wp-radio-my-account-navigation">
    <ul>
		<?php foreach ( $items as $endpoint => $label ) { ?>
            <li class="<?php echo $endpoint; ?>">
                <a href="#<?php echo $endpoint; ?>"><?php echo esc_html( $label ); ?></a>
            </li>
		<?php } ?>
    </ul>
</nav>

<nav class="wp-radio-my-account-content">
	<?php foreach ( $items as $endpoint => $label ) { ?>
        <div class="<?php echo $endpoint; ?>" id="content-<?php echo $endpoint; ?>">
			<?php
			wp_radio_get_template( "my-account/$endpoint", [], '', WR_USER_FRONTEND_TEMPLATES );
			?>
        </div>
	<?php } ?>
</nav>
