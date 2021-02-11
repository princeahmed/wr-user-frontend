<?php

defined( 'ABSPATH' ) || exit();

?>

<div class="wp-radio-notices"><?php do_action( 'wp_radio_notices' ); ?></div>

<div class="wp-radio-flex" id="submit-station">
    <div class="wp-radio-col-12">
		<?php if ( is_user_logged_in() ) { ?>
            <form class="wp-radio-form wp-radio-form-submit-station" method="post" action="<?php echo admin_url( 'admin-post.php' ); ?>" enctype="multipart/form-data">

                <!--Station Title-->
                <div class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="title"><?php esc_html_e( 'Station Title:', 'wp-radio-user-frontend' ); ?>
                        &nbsp;<span class="required">*</span>
                    </label>
                    <input type="text" class="wp-radio-input wp-radio-input--text" name="title" id="title" placeholder="Title" autocomplete="off"/>
                    <p class="description">Enter the name of the station.</p>
                </div>

                <!--Stream URL-->
                <div class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="stream_url"><?php esc_html_e( 'Stream URL:', 'wp-radio-user-frontend' ); ?>
                        &nbsp;<span class="required">*</span>
                    </label>
                    <input type="url" class="wp-radio-input wp-radio-input--text" name="stream_url" id="stream_url" placeholder="Stream URL" required/>
                    <p class="description">The streaming link of the radio station.</p>
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
								$countries = get_terms( [ 'taxonomy' => 'radio_country', 'parent' => 0, 'hide_empty' => false ] );

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
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
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
                        </p>
                    </div>

                </div>

                <!--Social Links-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="website"><?php esc_html_e( 'Website', 'wp-radio-user-frontend' ); ?></label>
                            <input type="text" name="website" id="website" placeholder="Website URL">
                            <input type="hidden" name="website" value="Website">
                        </p>
                    </div>

                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="facebook"><?php esc_html_e( 'Facebook', 'wp-radio-user-frontend' ); ?></label>
                            <input type="text" name="facebook" id="facebook" placeholder="Facebook URL">
                            <input type="hidden" name="facebook" value="Facebook">
                        </p>
                    </div>

                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="twitter"><?php esc_html_e( 'Twitter', 'wp-radio-user-frontend' ); ?></label>
                            <input type="text" name="twitter" id="twitter" placeholder="Twitter URL">
                            <input type="hidden" name="twitter" value="Twitter">
                        </p>
                    </div>

                </div>

                <!--Address-->
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="address"><?php esc_html_e( 'Address', 'wp-radio-user-frontend' ); ?></label>
                    <textarea name="address" id="address" placeholder="Station Address" rows="5"></textarea>
                </p>

                <!--Email, Phone-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-6">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="email"><?php esc_html_e( 'Email', 'wp-radio-user-frontend' ); ?></label>
                            <input type="email" name="email" id="email" placeholder="Contact Email">
                        </p>
                    </div>
                    <div class="wp-radio-col-6">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="phone"><?php esc_html_e( 'Phone', 'wp-radio-user-frontend' ); ?></label>
                            <input type="text" name="phone" id="phone" placeholder="Contact Phone">
                        </p>
                    </div>
                </div>

                <!--Submit-->
                <p class="wp-radio-form-row">
					<?php wp_nonce_field( 'wp-radio-submit-station', 'wp-radio-submit-station-nonce' ); ?>
                    <input type="hidden" name="action" value="submit_station">
                    <button type="submit" class="wp-radio-button button" name="submit"><?php esc_attr_e( 'Submit', 'wp-radio-user-frontend' ); ?></button>
                </p>

	            <?php wp_nonce_field(); ?>

            </form>
		<?php } else { ?>
            <p>Please, <a href="<?php echo get_the_permalink( wp_radio_get_settings( 'account_page',
					get_option( 'wp_radio_account_page' ) ) ); ?>">Login</a>to submit a station.</p>
		<?php } ?>
    </div>

</div>
