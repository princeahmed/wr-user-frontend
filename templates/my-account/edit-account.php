<?php

defined( 'ABSPATH' ) || exit();

$user = get_user_by( 'id', get_current_user_id() );

?>

<h3 class="section-title">Account Details</h3>

<form class="wp-radio-form wp-radio-form-edit-account" method="post" enctype="multipart/form-data">

    <p class="wp-radio-form-row wp-radio-form-row--wide avatar-field">
        <label for="avatar"><?php esc_html_e( 'Avatar Image:', 'wp-radio' ); ?></label>
        <input type="file" class="wp-radio-input wp-radio-input--text" name="avatar" id="avatar"/>
		<?php
		$avatar = get_user_meta( $user->ID, 'avatar', true );
		if ( ! empty( $avatar ) ) {
			printf( '<img src="%1$s">', wp_get_attachment_image_url( $avatar, 'wr_user_frontend_avatar_large' ) );
		}
		?>
    </p>

    <div class="wp-radio-flex">
        <div class="wp-radio-col-6">
            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="first_name"><?php esc_html_e( 'First Name', 'wp-radio' ); ?>
                    <span class="required">*</span></label>
                <input type="text" class="wp-radio-input wp-radio-input--text" name="first_name" id="first_name" required value="<?php echo esc_attr( $user->first_name ); ?>"/>
            </p>
        </div>
        <div class="wp-radio-col-6">
            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="last_name"><?php esc_html_e( 'Last Name', 'wp-radio' ); ?>
                    <span class="required">*</span></label>
                <input type="text" class="wp-radio-input wp-radio-input--text" name="last_name" id="last_name" required value="<?php echo esc_attr( $user->last_name ); ?>"/>
            </p>
        </div>
    </div>

    <p class="wp-radio-form-row wp-radio-form-row--wide">
        <label for="email"><?php esc_html_e( 'Email Address', 'wp-radio' ); ?>
            <span class="required">*</span></label>
        <input type="email" class="wp-radio-input wp-radio-input--text" name="email" id="email" required value="<?php echo esc_attr( $user->user_email ); ?>"/>
    </p>

    <div class="change-password">
        <button type="button" class="button change-password-button">Change Password</button>
        <div class="change-password-fields">
            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="current_password"><?php esc_html_e( 'Current password (leave blank to leave unchanged)', 'wp-radio' ); ?></label>
                <input type="password" class="wp-radio-input wp-radio-input--text" name="current_password" id="current_password"/>
            </p>

            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="new_password"><?php esc_html_e( 'New password (leave blank to leave unchanged)', 'wp-radio' ); ?></label>
                <input type="password" class="wp-radio-input wp-radio-input--text" name="new_password" id="new_password"/>
            </p>

            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="confirm_password"><?php esc_html_e( 'Confirm new password', 'wp-radio' ); ?></label>
                <input type="password" class="wp-radio-input wp-radio-input--text" name="confirm_password" id="confirm_password"/>
            </p>
        </div>
    </div>

    <p class="wp-radio-form-row">
		<?php wp_nonce_field( 'wp_radio_save_account_details', 'wp_radio_save_account_details_nonce' ); ?>
        <input type="hidden" name="action" value="wp_radio_save_account_details"/>
        <button type="submit" class="wp-radio-button button" name="submit"><?php esc_attr_e( 'Update', 'wp-radio' ); ?></button>
    </p>

</form>
