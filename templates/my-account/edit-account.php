<?php

defined( 'ABSPATH' ) || exit();

?>

<div class="account-content content-edit-account">
    <h3 class="section-title"><?php _e('Account Details', 'wp-radio'); ?></h3>

    <form class="wp-radio-form wp-radio-form-edit-account">

        <div class="form-message"></div>

        <div class="wp-radio-flex">
            <div class="wp-radio-col-6">
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="first_name"><?php esc_html_e( 'First Name', 'wp-radio-user-frontend' ); ?>
                        <span class="required">*</span></label>
                    <input type="text" class="wp-radio-input wp-radio-input--text" name="first_name" id="first_name"
                           required value="<?php echo esc_attr( $user->first_name ); ?>"/>
                </p>
            </div>
            <div class="wp-radio-col-6">
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="last_name"><?php esc_html_e( 'Last Name', 'wp-radio-user-frontend' ); ?>
                        <span class="required">*</span></label>
                    <input type="text" class="wp-radio-input wp-radio-input--text" name="last_name" id="last_name"
                           required value="<?php echo esc_attr( $user->last_name ); ?>"/>
                </p>
            </div>
        </div>

        <p class="wp-radio-form-row wp-radio-form-row--wide">
            <label for="email"><?php esc_html_e( 'Email Address', 'wp-radio-user-frontend' ); ?>
                <span class="required">*</span></label>
            <input type="email" class="wp-radio-input wp-radio-input--text" name="email" id="email" required
                   value="<?php echo esc_attr( $user->user_email ); ?>"/>
        </p>

        <div class="change-password">
            <button type="button" class="button change-password-button">Change Password</button>
            <div class="change-password-fields">
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="current_password"><?php esc_html_e( 'Current password (leave blank to leave unchanged)', 'wp-radio-user-frontend' ); ?></label>
                    <input type="password" class="wp-radio-input wp-radio-input--text" name="current_password"
                           id="current_password"/>
                </p>

                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="new_password"><?php esc_html_e( 'New password (leave blank to leave unchanged)', 'wp-radio-user-frontend' ); ?></label>
                    <input type="password" class="wp-radio-input wp-radio-input--text" name="new_password"
                           id="new_password"/>
                </p>

                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="confirm_password"><?php esc_html_e( 'Confirm new password', 'wp-radio-user-frontend' ); ?></label>
                    <input type="password" class="wp-radio-input wp-radio-input--text" name="confirm_password"
                           id="confirm_password"/>
                </p>
            </div>
        </div>

        <p class="wp-radio-form-row">
			<?php wp_nonce_field(); ?>
            <input type="hidden" name="action" value="wp_radio_save_account_details"/>
            <button type="submit" class="wp-radio-button button"
                    name="submit"><?php esc_attr_e( 'Update Details', 'wp-radio-user-frontend' ); ?></button>
        </p>

    </form>
</div>