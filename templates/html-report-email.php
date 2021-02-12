<div class="email-wrap">
	<h3>
		<?php
		printf(
		/* translators: %s: station name*/
			__( 'New report submitted for: %s', 'wp-radio-user-frontend' ),
			'<a href="' . get_the_permalink( $station_id ) . '">' . get_the_title( $station_id ) . '</a>'
		);
		?>
	</h3>

    <strong><?php esc_html_e( 'Report Details', 'wp-radio-user-frontend' ); ?></strong>

    <table border="0">
		<tbody>

        <!-- sender email -->
		<tr>
			<th style="width: 20%">
				<?php _e( 'Sender Email:', 'wp-radio-user-frontend' ); ?>
			</th>
			<td>
				<?php printf( '<a href="mailto:%1$s">%1$s</a>', $email ); ?>
			</td>
		</tr>

        <!-- issue -->
        <tr>
			<th style="width: 20%">
				<?php esc_html_e( 'Issue:', 'wp-radio-user-frontend' ); ?>
			</th>
			<td>
				<?php echo $issue; ?>
			</td>
		</tr>

        <!-- sender message -->
        <tr>
			<th style="width: 20%">
				<?php esc_html_e( 'Message:', 'wp-radio-user-frontend' ); ?>
			</th>
			<td>
				<?php echo $message; ?>
			</td>
		</tr>

		</tbody>
	</table>
</div>