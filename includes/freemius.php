<?php

defined('ABSPATH') || exit;

if ( ! function_exists( 'wr_user_frontend_fs' ) ) {
	// Create a helper function for easy SDK access.
	function wr_user_frontend_fs() {
		global $wr_user_frontend_fs;

		if ( ! isset( $wr_user_frontend_fs ) ) {
			// Activate multisite network integration.
			if ( ! defined( 'WP_FS__PRODUCT_4907_MULTISITE' ) ) {
				define( 'WP_FS__PRODUCT_4907_MULTISITE', true );
			}

			// Include Freemius SDK.
			if ( file_exists( WP_RADIO_INCLUDES . '/freemius/start.php' )) {
				// Try to load SDK from parent plugin folder.
				require_once WP_RADIO_INCLUDES . '/freemius/start.php';
			} else {
				return;
			}

			$wr_user_frontend_fs = fs_dynamic_init( array(
				'id'                  => '4907',
				'slug'                => 'wp-radio-user-frontend',
				'type'                => 'plugin',
				'public_key'          => 'pk_bef0527f73d6c3a11a9bd4f5cd644',
				'is_premium'          => true,
				'is_premium_only'     => true,
				'has_paid_plans'      => true,
				'is_org_compliant'    => false,
				'parent'              => array(
					'id'         => '4227',
					'slug'       => 'wp-radio',
					'public_key' => 'pk_6acab182f004d200ec631d063d6c4',
					'name'       => 'WP Radio - Worldwide Radio Station Directory',
				),
				'menu'                => array(
					'slug'           => 'edit.php?post_type=wp_radio',
					'first-path'     => 'edit.php?post_type=wp_radio&page=get-started',
					'support'        => false,
				),
				// Set the SDK to work in a sandbox mode (for development & testing).
				// IMPORTANT: MAKE SURE TO REMOVE SECRET KEY BEFORE DEPLOYMENT.
				//'secret_key'          => 'sk_3pm3@)ftAf:N3?*MMgsScO@VQXB+.',
			) );
		}

		return $wr_user_frontend_fs;
	}
}