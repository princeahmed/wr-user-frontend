<?php

if ( ! function_exists( 'wr_user_frontend_fs' ) ) {

	// Create a helper function for easy SDK access.
	function wr_user_frontend_fs() {
		global $wr_user_frontend_fs;

		if ( ! isset( $wr_user_frontend_fs ) ) {
			// Include Freemius SDK.
			require_once WP_RADIO_FREEMIUS_FILE;

			$wr_user_frontend_fs = fs_dynamic_init( array(
				'id'               => '4907',
				'slug'             => 'wp-radio-user-frontend',
				'type'             => 'plugin',
				'public_key'       => 'pk_bef0527f73d6c3a11a9bd4f5cd644',
				'is_premium'       => false,
				'has_paid_plans'   => false,
				'is_org_compliant' => false,
				'parent'           => array(
					'id'         => '4227',
					'slug'       => 'wp-radio-user-frontend',
					'public_key' => 'pk_6acab182f004d200ec631d063d6c4',
					'name'       => 'WP Radio - Worldwide Radio Station Directory',
				),
				'menu'             => array(
					'first-path' => 'plugins.php',
					'account'    => false,
					'support'    => false,
				),
			) );
		}

		return $wr_user_frontend_fs;
	}
}

function wr_user_frontend_fs_is_parent_active_and_loaded() {
	// Check if the parent's init SDK method exists.
	return function_exists( 'wr_fs' );
}

function wr_user_frontend_fs_is_parent_active() {
	$active_plugins = get_option( 'active_plugins', array() );

	if ( is_multisite() ) {
		$network_active_plugins = get_site_option( 'active_sitewide_plugins', array() );
		$active_plugins         = array_merge( $active_plugins, array_keys( $network_active_plugins ) );
	}

	foreach ( $active_plugins as $basename ) {
		if ( 0 === strpos( $basename, 'wp-radio/' ) ||
		     0 === strpos( $basename, 'wp-radio-premium/' )
		) {
			return true;
		}
	}

	return false;
}

function wr_user_frontend_fs_init() {
	if ( wr_user_frontend_fs_is_parent_active_and_loaded() ) {
		// Init Freemius.
		wr_user_frontend_fs();


		// Signal that the add-on's SDK was initiated.
		do_action( 'wr_user_frontend_fs_loaded' );

		// Parent is active, add your init code here.

	} else {

		// Parent is inactive, add your error handling here.
	}
}

if ( wr_user_frontend_fs_is_parent_active_and_loaded() ) {
	// If parent already included, init add-on.
	wr_user_frontend_fs_init();
} else if ( wr_user_frontend_fs_is_parent_active() ) {
	// Init add-on only after the parent is loaded.
	add_action( 'wr_fs_loaded', 'wr_user_frontend_fs_init' );
} else {
	// Even though the parent is not activated, execute add-on for activation / uninstall hooks.
	wr_user_frontend_fs_init();
}
