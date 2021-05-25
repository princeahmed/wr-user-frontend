<?php

defined( 'ABSPATH' ) || exit();

$id     = '';
$title  = '';
$active = '';

if ( ! empty( $_GET['report_station_id'] ) ) {
	$id     = intval( $_GET['report_station_id'] );
	$title  = get_the_title( $id );
	$active = 'active';
}

?>

<div id="report-form-wrapper" class="report-form-wrapper <?php echo $active; ?>">
    <form name="wp-radio-from report-form" class="report-form">

        <i class="dashicons dashicons-dismiss report-close"></i>

        <div class="report-before">
            <h4 class="form-title"><?php esc_html_e( 'Report a Problem with Station:', 'wp-radio-user-frontend' ); ?></h4>

            <div id="report-validation" class="report-validation"><?php esc_html_e( 'Please, Fill out all the fields.',
			        'wp-radio-user-frontend' ); ?></div>

            <div class="wp-radio-form-row report-email-field">
                <label for="report-email"><?php esc_html_e( 'Your Email:', 'wp-radio-user-frontend' ); ?></label>
                <input type="email" name="email" id="report-email" required>
            </div>

            <!-- select issue -->
            <div class="wp-radio-form-row issue-field">
                <label for="issue"><?php esc_html_e( 'Select issue:', 'wp-radio-user-frontend' ); ?></label>
                <select name="issue" id="issue" required>
                    <option value="">Select the issue</option>
                    <option>The page is not working</option>
                    <option>Playback is not working</option>
                    <option>Address or radio data is incorrect</option>
                    <option>The site is using an incorrect stream link</option>
                </select>
            </div>

            <!-- report message -->
            <div class="wp-radio-form-row report-message-field">
                <label for="report-message"><?php esc_html_e( 'Your Message:', 'wp-radio-user-frontend' ); ?></label>
                <textarea name="message" id="report-message" cols="30" rows="3"></textarea>
            </div>

            <div class="wp-radio-form-row report-radio-field">
                <span><?php esc_html_e( 'Radio Station:', 'wp-radio-user-frontend' ); ?></span>
                <a href="#" class="report-radio" id="report-radio"><?php echo $title; ?></a>
                <input type="hidden" name="id" id="report-radio-id" value="<?php echo $id; ?>">
            </div>

            <div class="wp-radio-form-row report-submit-field">
                <button type="submit" id="report-submit" aria-label="<?php _e('Submit', 'wp-radio'); ?>" title="<?php _e('Submit', 'wp-radio'); ?>" class="button report-submit"><?php esc_html_e( 'Send Message', 'wp-radio-user-frontend' ); ?></button>
            </div>

        </div>

        <div class="report-after">
            <h3 class="confirm-message"><?php printf(__( 'Your message has been sent. Thanks %s', 'wp-radio-user-frontend' ), '😊'); ?></h3>
        </div>

    </form>
</div>