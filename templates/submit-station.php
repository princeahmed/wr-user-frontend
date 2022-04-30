<?php

defined( 'ABSPATH' ) || exit();

?>

<div class="wp-radio-flex" id="submit-station">

    <div class="wp-radio-col-12">
		<?php if ( is_user_logged_in() ) { ?>
            <form class="wp-radio-form wp-radio-form-submit-station" method="post"
                  action="<?php echo admin_url( 'admin-post.php' ); ?>" enctype="multipart/form-data">

                <div class="form-message">
		            <?php
		            if ( ! empty( $_GET['success'] ) ) {
			            printf( '<p class="success">%s</p>', __( 'Station submitted successfully, waiting for admin approval.', 'wp-radio-user-frontend' ) );
		            }
		            if( ! empty( $_GET['err'] ) && $_GET['err'] == 'nonce' ) {
			            printf( '<p class="error">%s</p>', __( 'Your session has been expired!', 'wp-radio-user-frontend' ) );
		            }

		            if( ! empty( $_GET['err'] ) && $_GET['err'] == 'captcha' ) {
			            printf( '<p class="error">%s</p>', __( 'Captcha didn\'t match', 'wp-radio-user-frontend' ) );
		            }

		            if( ! empty( $_GET['err'] ) && $_GET['err'] == 'error' ) {
			            printf( '<p class="error">%s</p>', __( 'Something went wrong, please try again later.', 'wp-radio-user-frontend' ) );
		            }

		            ?>
                </div>

                <!--Station Title-->
                <div class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="title"><?php esc_html_e( 'Station Title:', 'wp-radio-user-frontend' ); ?>&nbsp;<span
                                class="required">*</span>
                    </label>
                    <input type="text" required class="wp-radio-input wp-radio-input--text" name="title" id="title"
                           placeholder="Station title" autocomplete="off"/>
                    <p class="description">Enter the name of the station.</p>
                </div>

                <!--Station Slogan-->
                <div class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="slogan"><?php esc_html_e( 'Station Slogan:', 'wp-radio-user-frontend' ); ?></label>
                    <input type="text" class="wp-radio-input wp-radio-input--text" name="slogan" id="slogan"
                           placeholder="Slogan/subtitle"/>
                    <p class="description">Enter the slogan/subtitle of the station.</p>
                </div>

                <!--Stream URL-->
                <div class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="stream_url"><?php esc_html_e( 'Stream URL:', 'wp-radio-user-frontend' ); ?>
                        &nbsp;<span class="required">*</span>
                    </label>
                    <input type="url" class="wp-radio-input wp-radio-input--text" name="stream_url" id="stream_url"
                           placeholder="Stream URL" required/>
                    <p class="description">Enter the streaming link of the radio station.</p>
                </div>

                <!--Station Description-->
                <div class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="content"><?php esc_html_e( 'Station Description:', 'wp-radio-user-frontend' ); ?>
                        &nbsp;<span class="required">*</span>
                    </label>
                    <textarea name="content" id="content" placeholder="Description" rows="4" required></textarea>
                </div>

                <!--Station Image-->
                <div class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="thumbnail"><?php esc_html_e( 'Station Image:', 'wp-radio-user-frontend' ); ?></label>
                    <input type="file" class="wp-radio-input wp-radio-input--text" name="thumbnail" id="thumbnail"/>
                    <p class="description">The logo of the station.</p>
                </div>

                <!--Station Country, Genres, Language-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-6">
                        <div class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="country"><?php esc_html_e( 'Station Country', 'wp-radio-user-frontend' ); ?>
                                &nbsp;<span class="required">*</span>
                            </label>
                            <select class="wp-radio-input wp-radio-select2" name="country" id="country" required>
                                <option value="">Select Country</option>
								<?php
								$countries = get_terms( [
									'taxonomy'   => 'radio_country',
									'parent'     => 0,
									'hide_empty' => false
								] );

								if ( ! empty( $countries ) ) {
									$countries = wp_list_pluck( $countries, 'name', 'term_id' );
									foreach ( $countries as $id => $name ) {
										printf( '<option value="%s">%s</option>', $id, $name );
									}
								}
								?>
                            </select>
                            <p class="description">Select the station country</p>
                        </div>
                    </div>

                    <!--station genres -->
                    <div class="wp-radio-col-6">
                        <div class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="genres"><?php esc_html_e( 'Station Genres:', 'wp-radio-user-frontend' ); ?></label>
                            <select class="wp-radio-input wp-radio-select2" name="genres[]" id="genres" multiple>
                                <option value="">Select Genres</option>
								<?php
								$genres = get_terms( [ 'taxonomy' => 'radio_genre', 'hide_empty' => false ] );

								if ( ! empty( $genres ) ) {
									$genres = wp_list_pluck( $genres, 'name', 'term_id' );
									foreach ( $genres as $id => $name ) {
										printf( '<option value="%s">%s</option>', $id, $name );
									}
								}

								?>
                            </select>

                            <p class="description">Select the station genres</p>
                        </div>
                    </div>

                </div>

                <!--Social Links-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-4">
                        <div class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="website"><?php esc_html_e( 'Website', 'wp-radio-user-frontend' ); ?></label>
                            <input type="text" name="website" id="website" placeholder="Website URL">
                            <p class="description">Enter the station website url.</p>
                        </div>
                    </div>

                    <div class="wp-radio-col-4">
                        <div class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="facebook"><?php esc_html_e( 'Facebook', 'wp-radio-user-frontend' ); ?></label>
                            <input type="text" name="facebook" id="facebook" placeholder="Facebook URL">
                            <p class="description">Enter the station facebook url</p>
                        </div>
                    </div>

                    <div class="wp-radio-col-4">
                        <div class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="twitter"><?php esc_html_e( 'Twitter', 'wp-radio-user-frontend' ); ?></label>
                            <input type="text" name="twitter" id="twitter" placeholder="Twitter URL">
                            <p class="description">Enter the station twitter url.</p>
                        </div>
                    </div>

                </div>

                <!--Address-->
                <div class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="address"><?php esc_html_e( 'Address', 'wp-radio-user-frontend' ); ?></label>
                    <textarea name="address" id="address" placeholder="Station Address" rows="4"></textarea>
                    <p class="description">Enter the radio station address.</p>
                </div>

                <!--Email, Phone-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-6">
                        <div class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="email"><?php esc_html_e( 'Email', 'wp-radio-user-frontend' ); ?></label>
                            <input type="email" name="email" id="email" placeholder="Contact Email">
                            <p class="description">Enter the station contact email.</p>
                        </div>
                    </div>
                    <div class="wp-radio-col-6">
                        <div class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="phone"><?php esc_html_e( 'Phone', 'wp-radio-user-frontend' ); ?></label>
                            <input type="text" name="phone" id="phone" placeholder="Contact Phone">
                            <p class="description">Enter the station contact phone number.</p>
                        </div>
                    </div>
                </div>

                <!--Captcha-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-12">
                        <div class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="captcha_code"><?php esc_html_e( 'Captcha', 'wp-radio-user-frontend' ); ?>
                                &nbsp;<span class="required">*</span>
                            </label>

                            <!-- simple numeric captcha -->
							<?php
							$num1    = rand( 1, 10 );
							$num2    = rand( 1, 10 );
							$captcha = $num1 + $num2;
							?>
                            <div class="captcha-wrap">
								<?php echo $num1; ?> + <?php echo $num2; ?> =
                                <input type="number" name="captcha_code" id="captcha_code" required>
                                <input type="hidden" name="captcha" value="<?php echo $num1 + $num2; ?>">
                            </div>
                            <p class="description">Enter the sum of the numbers</p>
                        </div>
                    </div>
                </div>

                <!--Submit-->
                <p class="wp-radio-form-row">
					<?php wp_nonce_field( 'wp-radio-submit-station', 'wp-radio-submit-station-nonce' ); ?>
                    <input type="hidden" name="action" value="submit_station">
                    <button type="submit" class="wp-radio-button button"
                            name="submit"><?php esc_attr_e( 'Submit', 'wp-radio-user-frontend' ); ?></button>
                </p>

				<?php wp_nonce_field(); ?>

            </form>
		<?php } else { ?>
            <p><?php esc_html_e( 'You are not allowed to submit a station.', 'wp-radio-user-frontend' ); ?></p>
            <p>Please, <a href="<?php echo get_the_permalink( wp_radio_get_settings( 'account_page' ) ); ?>">Login</a>
                first to submit a station.</p>
		<?php } ?>
    </div>

</div>