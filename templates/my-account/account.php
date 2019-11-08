<?php

defined( 'ABSPATH' ) || exit();

$items = array(
	'dashboard'    => [ 'icon' => 'dashboard', 'label' => __( 'Dashboard', 'wp-radio-user-frontend' ), ],
	'favourites'   => [ 'icon' => 'heart', 'label' => __( 'Favorites', 'wp-radio-user-frontend' ), ],
	'edit-account' => [ 'icon' => 'admin-users', 'label' => __( 'Account details', 'wp-radio-user-frontend' ), ],
);

?>

<div class="wp-radio-my-account wp-radio-flex">
    <nav class="wp-radio-my-account-navigation wp-radio-col-3">
        <ul>
			<?php foreach ( $items as $endpoint => $label ) { ?>
                <li class="to-<?php echo $endpoint; ?>" data-target=".content-<?php echo $endpoint; ?>">
                    <a href="#">
                        <i class="dashicons dashicons-<?php echo $label['icon'] ?>"></i>
						<?php echo esc_html( $label['label'] ); ?>
                    </a>
                </li>
			<?php } ?>

            <li class="logout">
                <a href="<?php echo wp_logout_url( get_the_permalink(prince_get_option('account_page', get_option( 'wp_radio_account_page' )))); ?>">
                    <i class="dashicons dashicons-migrate"></i>
                    Logout
                </a>
            </li>

        </ul>
    </nav>

    <div class="wp-radio-my-account-content wp-radio-col-9">

        <div class="wp-radio-notices">
			<?php do_action( 'wp_radio_notices' ); ?>
        </div>

		<?php foreach ( $items as $endpoint => $label ) { ?>
            <div class="content-<?php echo $endpoint; ?>" id="content-<?php echo $endpoint; ?>">
				<?php
				wp_radio_get_template( "my-account/$endpoint", [], '', WR_USER_FRONTEND_TEMPLATES );
				?>
            </div>
		<?php } ?>
    </div>
</div>
