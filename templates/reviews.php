<?php

defined( 'ABSPATH' ) || exit();

global $post;
$post_id = $post->ID;

$hash  = md5( $post_id . get_current_user_id() );
$exits = get_page_by_title( $hash, OBJECT, 'radio_review' );

$curr_user_rating = ! empty( $exits ) ? get_post_meta( $exits->ID, 'rating', 1 ) : 0;

?>

    <h3 class="review-section-title"><?php esc_html_e( 'Leave a Review', 'wp-radio-user-frontend' ); ?></h3>
    <div class="review-form-notices"></div>
    <form class="wp-radio-form review-form" id="review-form">
        <p class="wp-radio-form-row wp-radio-form-row--wide set-review">
            <label for="rating"><?php esc_html_e( 'Set your rating:', 'wp-radio-user-frontend' ); ?></label>

            <span class="set-review-stars">
                <?php
                for ( $i = 1; $i <= 5; $i ++ ) {
	                $class = ! empty( $curr_user_rating ) && $i <= $curr_user_rating ? 'filled' : 'empty';

	                printf( '<i class="dashicons dashicons-star-%1$s star" data-rate="%2$d"></i>', $class, $i );
                }
                ?>
            </span>

            <input type="hidden" name="rating" id="rating" value="<?php echo $curr_user_rating; ?>"/>
            <input type="hidden" name="user_id" id="user_id" value="<?php echo get_current_user_id(); ?>"/>
            <input type="hidden" name="object_id" id="object_id" value="<?php echo $post_id; ?>"/>
        </p>

        <p class="wp-radio-form-row wp-radio-form-row--wide">
            <label for="review"><?php esc_html_e( 'Your Review:', 'wp-radio-user-frontend' ); ?></label>
            <textarea name="review" id="review" placeholder="Your Review"
                      rows="3"><?php echo ! empty( $exits ) ? $exits->post_content : ''; ?></textarea>
        </p>

        <!--Submit-->
        <p class="wp-radio-form-row">
            <button type="submit" class="wp-radio-button button <?php echo ! is_user_logged_in() ? 'disabled' : ''; ?>"
                    name="submit" id="review_submit" data-offset="10">
				<?php echo ! empty( $exits ) ? __( 'Update', 'wp-radio-user-frontend' ) : __( 'Submit', 'wp-radio-user-frontend' ); ?>
            </button>
        </p>

    </form>

    <div class="review-listing">
		<?php

		$reviews = get_posts( [
			'post_type'   => 'radio_review',
			'meta_key'    => 'object_id',
			'meta_value'  => $post_id,
			'numberposts' => 10,
		] );

		if ( ! empty( $reviews ) ) {
			printf( '<h3 class="review-listing-title">%1$s reviews : </h3>', get_the_title( $post_id ) );
			foreach ( $reviews as $review ) {
				wp_radio_get_template( 'review-loop', [ 'review_id' => $review->ID ], '', WR_USER_FRONTEND_TEMPLATES );
			}
		}

		?>
    </div>

<?php if ( count( $reviews ) > 9 ) { ?>
    <p class="more-review">
        <button class="load-more-review button"><?php esc_html_e( 'Load More Reviews', 'wp-radio-user-frontend' ); ?></button>
    </p>
<?php } ?>