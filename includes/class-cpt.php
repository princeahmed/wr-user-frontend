<?php

defined( 'ABSPATH' ) || exit();

class WR_User_Frontend_CPT {
	public function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
	}

	function register_post_types() {
		register_post_type( 'radio_review', [] );
	}

}

new WR_User_Frontend_CPT();