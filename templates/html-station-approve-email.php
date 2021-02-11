<div class="email-wrap">

    <h3><?php esc_html_e( 'Your submission to add a radio station has been confirmed:', 'wp-radio-user-frontend' ); ?></h3>

    <table border="0">
        <tbody>

        <tr>
            <th>Station Title:</th>
            <td><?php echo get_the_title( $post_id ); ?></td>
        </tr>

        </tbody>
    </table>

    <table>
        <tr>
            <td><?php printf( '<a href="%1$s" style="background: cornflowerblue;padding: 5px;margin: 5px;display: inline-block;width: 80px;text-align: center;color: #fff;text-decoration: none;border-radius: 5px;">%2$s</a>', get_permalink( $post_id ), __( 'View Station', 'wp-radio-user-frontend' ) ); ?></td>
        </tr>
    </table>

</div>