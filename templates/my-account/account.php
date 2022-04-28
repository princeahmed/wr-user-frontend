<?php

defined( 'ABSPATH' ) || exit();

$user = get_user_by( 'id', get_current_user_id() );


$menus = [
	'dashboard' => [
		'icon'  => 'dashicons-dashboard',
		'title' => __( 'Dashboard', 'wp-radio-user-frontend' ),
		'url'   => '#',
	],
	'favorites' => [
		'icon'  => 'dashicons-heart',
		'title' => __( 'Favorites', 'wp-radio-user-frontend' ),
		'url'   => '#',
	],
	'submit-station' => [
		'icon'  => 'dashicons-plus-alt',
		'title' => __( 'Submit station', 'wp-radio-user-frontend' ),
		'url'   => get_permalink( wp_radio_get_settings( 'submit_station_page' ) ),
	],
	'edit-account' => [
		'icon'  => 'dashicons-admin-users',
		'title' => __( 'Edit account', 'wp-radio-user-frontend' ),
		'url'   => '#',
	],

	'logout' => [
		'icon'  => 'dashicons-migrate',
		'title' => __( 'Logout', 'wp-radio-user-frontend' ),
		'url'   => wp_logout_url(get_permalink( wp_radio_get_settings( 'account_page' ) )),
	],
];

?>

<div class="wp-radio-my-account wp-radio-flex">
    <nav class="wp-radio-my-account-navigation wp-radio-col-3">
        <ul>
			<?php
			foreach ( $menus as $key => $menu ) {
				printf( '<li class="%s"><a href="%s" data-target="%s"><i class="dashicons %s"></i>%s</a></li>', $key == 'dashboard' ? 'active' : '', $menu['url'], $key,$menu['icon'], $menu['title'] );
			}
			?>
        </ul>
    </nav>

    <div class="wp-radio-my-account-content wp-radio-col-9">
		<?php
		wp_radio_get_template( 'my-account/dashboard', [ 'user' => $user ], '', WR_USER_FRONTEND_TEMPLATES );

		wp_radio_get_template( 'my-account/favorites', '', '', WR_USER_FRONTEND_TEMPLATES );

		wp_radio_get_template( 'my-account/edit-account', [ 'user' => $user ], '', WR_USER_FRONTEND_TEMPLATES );
		?>
    </div>

</div>
