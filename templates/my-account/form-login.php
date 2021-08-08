<?php defined( 'ABSPATH' ) || exit(); ?>

<div class="wp-radio-flex" id="listener-login">

    <div class="wp-radio-col-6">

        <h2><?php esc_html_e( 'Login', 'wp-radio-user-frontend' ); ?></h2>

        <form class="wp-radio-form wp-radio-form-login" method="post">

            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="username"><?php esc_html_e( 'Username or email address', 'wp-radio-user-frontend' ); ?>
                    &nbsp;<span class="required">*</span></label>
                <input type="text" class="wp-radio-input wp-radio-input--text" name="username" id="username"
                       autocomplete="username"
                       value="<?php echo ( ! empty( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; ?>"/>
            </p>

            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="password"><?php esc_html_e( 'Password', 'wp-radio-user-frontend' ); ?>
                    &nbsp;<span class="required">*</span></label>
                <input class="wp-radio-input wp-radio-input--text" type="password" name="password" id="password"
                       autocomplete="current-password"/>
            </p>


            <p class="wp-radio-form-row">
                <label class="wp-radio-form__label wp-radio-form__label-for-checkbox wp-radio-form-login__rememberme">
                    <input class="wp-radio-form__input wp-radio-form__input-checkbox" name="rememberme" type="checkbox"
                           id="rememberme" value="forever"/>
                    <span><?php esc_html_e( 'Remember me', 'wp-radio-user-frontend' ); ?></span>
                </label>
				<?php wp_nonce_field( 'wp-radio-login', 'wp-radio-login-nonce' ); ?>
                <button type="submit" class="wp-radio-button button wp-radio-form-login__submit button" name="login"
                        value="<?php esc_attr_e( 'Log in', 'wp-radio-user-frontend' ); ?>"><?php esc_html_e( 'Log in', 'wp-radio-user-frontend' ); ?></button>
            </p>

            <p class="wp-radio-lost-password">
                <a href="<?php echo esc_url( wp_lostpassword_url() ); ?>"><?php esc_html_e( 'Lost your password?', 'wp-radio-user-frontend' ); ?></a>
            </p>

        </form>

    </div>

    <div class="wp-radio-col-6">

        <h2><?php esc_html_e( 'Register', 'wp-radio-user-frontend' ); ?></h2>

        <form method="post" class="wp-radio-form wp-radio-form-register register">

            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="reg_username"><?php esc_html_e( 'Username', 'wp-radio-user-frontend' ); ?>
                    &nbsp;<span class="required">*</span></label>
                <input type="text" class="wp-radio-input wp-radio-input--text" name="username" id="reg_username"
                       autocomplete="username"
                       value="<?php echo ( ! empty( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; ?>"/><?php // @codingStandardsIgnoreLine ?>
            </p>

            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="reg_email"><?php esc_html_e( 'Email address', 'wp-radio-user-frontend' ); ?>
                    &nbsp;<span class="required">*</span></label>
                <input type="email" class="wp-radio-input wp-radio-input--text" name="email" id="reg_email"
                       autocomplete="email"
                       value="<?php echo ( ! empty( $_POST['email'] ) ) ? esc_attr( wp_unslash( $_POST['email'] ) ) : ''; ?>"/><?php // @codingStandardsIgnoreLine ?>
            </p>

            <p class="wp-radio-form-row wp-radio-form-row--wide">
                <label for="reg_password"><?php esc_html_e( 'Password', 'wp-radio-user-frontend' ); ?>
                    &nbsp;<span class="required">*</span></label>
                <input type="password" class="wp-radio-input wp-radio-input--text" name="password" id="reg_password"
                       autocomplete="new-password"/>
            </p>

            <div class="wp-radio-flex">
                <div class="wp-radio-col-6">
                    <p class="wp-radio-form-row wp-radio-form-row--wide">
                        <label for="first_name"><?php esc_html_e( 'First Name', 'wp-radio-user-frontend' ); ?></label>
                        <input type="text" name="first_name" id="first_name" placeholder="First Name">
                    </p>
                </div>
                <div class="wp-radio-col-6">
                    <p class="wp-radio-form-row wp-radio-form-row--wide">
                        <label for="last_name"><?php esc_html_e( 'Last Name', 'wp-radio-user-frontend' ); ?></label>
                        <input type="text" name="last_name" id="last_name" placeholder="Last Name">
                    </p>
                </div>
            </div>

            <p class="wp-radio-form-row wp-radio-submit-row">
				<?php wp_nonce_field( 'wp-radio-register', 'wp-radio-register-nonce' ); ?>
                <button type="submit" class="wp-radio-button button" name="register"
                        value="<?php esc_attr_e( 'Register', 'wp-radio-user-frontend' ); ?>"><?php esc_html_e( 'Register', 'wp-radio-user-frontend' ); ?></button>
            </p>


        </form>

    </div>

</div>