<div class="email-wrap">
    <h3><?php esc_html_e( 'New request submitted to add a station.', 'wp-radio-user-frontend' ); ?></h3>
    <strong><?php esc_html_e( 'Station Details:', 'wp-radio-user-frontend' ); ?></strong>

    <table border="0">
        <tbody>
		<?php
		foreach ( $args as $label => $value ) {
			printf( '<tr><th>%1$s:</th><td>%2$s</td></tr>', $label, $value );
		}
		?>
        </tbody>
    </table>

	<?php printf( '<a href="%1$s">%2$s</a>', get_edit_post_link( $post_id ), __( 'View Station', 'wp-radio-user-frontend' ) ); ?>

</div>