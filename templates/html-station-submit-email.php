<div class="email-wrap">

    <h3><?php esc_html_e( 'New station submission is waiting for your confirmation:', 'wp-radio-user-frontend' ); ?></h3>
    <h4><?php esc_html_e( 'Station Details:', 'wp-radio-user-frontend' ); ?></h4>
    <hr>

    <table border="0">
        <tbody>
		<?php
		foreach ( $args as $label => $value ) {
			printf( '<tr><th>%1$s:</th><td>%2$s</td></tr>', $label, $value );
		}
		?>
        </tbody>
    </table>

    <table>
        <tr>
            <td><?php printf( '<a href="%1$s" style="background: cornflowerblue;padding: 5px;margin: 5px;display: inline-block;width: 80px;text-align: center;color: #fff;text-decoration: none;border-radius: 5px;">%2$s</a>',
					add_query_arg( [ 'action' => 'view_station_submission', 'id' => $post_id ], admin_url() ),
					__( 'View Station', 'wp-radio-user-frontend' ) ); ?></td>

            <td><?php printf( '<a href="%1$s" style="background: cornflowerblue;padding: 5px;margin: 5px;display: inline-block;width: 90px;text-align: center;color: #fff;text-decoration: none;border-radius: 5px;">%2$s</a>',
					add_query_arg( [ 'action' => 'view_station_submission', 'id' => $post_id, 'type' => 'approve' ], admin_url() ),
					__( 'Approve Station', 'wp-radio-user-frontend' ) ); ?></td>
        </tr>
    </table>

</div>