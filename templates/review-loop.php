<?php
defined( 'ABSPATH' ) || exit();

$object_id = get_post_meta( $review_id, 'object_id', true );
$user_id   = get_post_meta( $review_id, 'user_id', true );
$rating    = get_post_meta( $review_id, 'rating', true );

$user = get_user_by( 'id', $user_id );

$avatar = get_avatar_url( $user_id );

?>

<div class="single-review <?php echo get_current_user_id() == $user_id ? 'current-user-review' : ''; ?>">
    <div class="reviewer-avatar">
        <img src="<?php echo $avatar; ?>" alt="" width="32" height="32">
    </div>
    <div class="reviewer-name">
        <span><?php echo $user->first_name . ' ' . $user->last_name; ?></span>
    </div>
    <div class="reviewer-rating">
		<?php
		for ( $i = 0; $i < 5; $i ++ ) {
			$class = $i < $rating ? 'filled' : 'empty';
			printf( '<i class="dashicons dashicons-star-%s"></i>', $class );
		}
		?>

    </div>
    <div class="review-date">
        <span><?php echo get_the_date( '', $review_id ); ?></span>
    </div>

    <div class="review-comments">
        <p><?php echo get_post_field( 'post_content', $review_id ); ?></p>
    </div>

</div>