<?php

defined( 'ABSPATH' ) || exit();

?>


<div class="wp-radio-flex" id="submit-station">

    <div class="wp-radio-col-12">
		<?php if ( is_user_logged_in() ) { ?>
            <form class="wp-radio-form wp-radio-form-submit-station" method="post" action="<?php echo admin_url( 'admin-post.php' ); ?>" enctype="multipart/form-data">

                <!--Station Title-->
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="title"><?php esc_html_e( 'Station Name', 'wp-radio' ); ?>
                        &nbsp;<span class="required">*</span>
                    </label>
                    <input type="text" class="wp-radio-input wp-radio-input--text" name="title" id="title" placeholder="Title" autocomplete="off"/>
                </p>

                <!--Station Description-->
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="content"><?php esc_html_e( 'Description', 'wp-radio' ); ?></label>
                    <textarea name="content" id="content" placeholder="Description" rows="5"></textarea>
                </p>

                <!--Station Image-->
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="thumbnail"><?php esc_html_e( 'Station Image', 'wp-radio' ); ?></label>
                    <input type="file" class="wp-radio-input wp-radio-input--text" name="thumbnail" id="thumbnail"/>
                </p>

                <!--Station Country, Genres, Language-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="country"><?php esc_html_e( 'Country', 'wp-radio' ); ?>
                                &nbsp;<span class="required">*</span>
                            </label>
                            <select class="wp-radio-input wp-radio-select2" name="country" id="country" required>
                                <option value="">Select Country</option>
								<?php
								$countries = get_terms( [ 'taxonomy' => 'radio_country', 'hide_empty' => false ] );

								if ( ! empty( $countries ) ) {
									$countries = wp_list_pluck( $countries, 'name', 'term_id' );
									foreach ( $countries as $id => $name ) {
										printf( '<option value="%s">%s</option>', $id, $name );
									}
								}
								?>
                            </select>
                        </p>
                    </div>

                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="genres"><?php esc_html_e( 'Genres', 'wp-radio' ); ?></label>
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

                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="language"><?php esc_html_e( 'Language', 'wp-radio' ); ?></label>
                            <select class="wp-radio-input wp-radio-select2" name="language" id="language">
                                <option value="">Select Language</option>
								<?php
								foreach ( wp_radio_get_language() as $key => $label ) {
									printf( '<option value="%1$s">%2$s</option>', $key, $label );
								}
								?>
                            </select>
                        </p>
                    </div>
                </div>

                <!--Stream URL-->
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="stream_url"><?php esc_html_e( 'Stream URL', 'wp-radio' ); ?>
                        &nbsp;<span class="required">*</span>
                    </label>
                    <input type="url" class="wp-radio-input wp-radio-input--text" name="stream_url" id="stream_url" placeholder="Stream URL" required/>
                </p>

                <!--Social Links-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="website"><?php esc_html_e( 'Website', 'wp-radio' ); ?></label>
                            <input type="text" name="social-links[0][href]" id="website" placeholder="Website URL">
                            <input type="hidden" name="social-links[0][name]" value="Website">
                        </p>
                    </div>

                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="facebook"><?php esc_html_e( 'Facebook', 'wp-radio' ); ?></label>
                            <input type="text" name="social-links[1][href]" id="facebook" placeholder="Facebook URL">
                            <input type="hidden" name="social-links[1][name]" value="Facebook">
                        </p>
                    </div>

                    <div class="wp-radio-col-4">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="twitter"><?php esc_html_e( 'Twitter', 'wp-radio' ); ?></label>
                            <input type="text" name="social-links[2][href]" id="twitter" placeholder="Twitter URL">
                            <input type="hidden" name="social-links[2][name]" value="Twitter">
                        </p>
                    </div>

                </div>

                <!--Address-->
                <p class="wp-radio-form-row wp-radio-form-row--wide">
                    <label for="contact_address"><?php esc_html_e( 'Address', 'wp-radio' ); ?></label>
                    <textarea name="contact_address" id="contact_address" placeholder="Station Address" rows="5"></textarea>
                </p>

                <!--Email, Phone-->
                <div class="wp-radio-flex">
                    <div class="wp-radio-col-6">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="contact_email"><?php esc_html_e( 'Email', 'wp-radio' ); ?></label>
                            <input type="email" name="contact_email" id="contact_email" placeholder="Contact Email">
                        </p>
                    </div>
                    <div class="wp-radio-col-6">
                        <p class="wp-radio-form-row wp-radio-form-row--wide">
                            <label for="contact_phone"><?php esc_html_e( 'Phone', 'wp-radio' ); ?></label>
                            <input type="text" name="contact_phone" id="contact_phone" placeholder="Contact Phone">
                        </p>
                    </div>
                </div>

                <!--Submit-->
                <p class="wp-radio-form-row">
					<?php wp_nonce_field( 'wp-radio-submit-station', 'wp-radio-submit-station-nonce' ); ?>
                    <input type="hidden" name="action" value="submit_station">
                    <button type="submit" class="wp-radio-button button" name="submit"><?php esc_attr_e( 'Submit', 'wp-radio' ); ?></button>
                </p>

            </form>
		<?php } else { ?>
            <p>Please, <a href="<?php echo get_the_permalink(prince_get_option('account_page', get_option( 'wp_radio_account_page' ))); ?>">Login</a> to submit a station.</p>
		<?php } ?>
    </div>

</div>
