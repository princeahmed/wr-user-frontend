<?php
defined( 'ABSPATH' ) || exit();

$avatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEHBg4NBxESEA4PFgoOFBQSGQ8QEQ8SIBEiIhQdHxMYHCgsGCYxHR8fIzEtMSk3OjouIyszOD8tNzQ5Oi0BCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAIAAgAMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwUGBAIB/8QANRAAAgEDAAYGCAcBAAAAAAAAAAECAwQRBRIhMUFREyJhcYHBBhQjcpGhotEyM0JSYrGyJP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDegAAAAAAAAAAAAAAAAAAAAAAAAAAAeoQc5KMFlvZhAeQXlnodRWtdbX+1bl48Szp0Y0l7OKXckgMgDYVKUaq9pFS70mVt3oeM1m26suTzqv7AUIPdWm6U3GosNcDwAAAAAAAAAAAA0WibL1elrz/HL6VyKfRlHpr2Ke5dZ+BqgAAAAADg0nZK6pZiuvHOHz7DNNYe02hmdM0eivnjdLEvuBwgAAAAAAAAACz9H1/2y92X+kaEzGh6vRX8c7pa0fkacAAAAAAFD6Q/nw7pf2Xxm9OVNe+wv0qMfPzArwAAAAAAAAAB9T1Xlb9hqLC6V3QUv1LCkuTMsT2dxO3rJ0drezG163gBrQQ0JupTUpxcXyeMkwAAirT6Om5KLljgsZYHi8uFa0HOXDcubMrObqTcp7W22/jtJ7+5ncVvbbMZ6u3Z4M5gAAAAAAAAAB36KsfWqmtU/BHGf5PkB80fo6V29aXVhz59yL63tYW0cUo47eL8SaMVFYjsSwj0AAAAAAQXNtC5hirFPt4rx4FBpDRsrXrQ60OfGPejTHmUVJYltTygMaCw0rYeqz1qf5b+l8ivAAAAAAJKFJ160YQ3yaX3NVb0VQoqENy2FT6P0MzlUfDqrzLwAAAAAAAAAAAIq9JVqThPdLKMpcUXQrShLfFtd/I2BSekFDbCqvdfl5gUwAAAADT6Jp9HYQ7cy+LO0jt46lCC5KK+RIAAAAAAAAAAAA49KU+lsJrknL4bTsI6q16UlzUl8gMeAAP/2Q==';

$object_id = get_post_meta( $review_id, 'object_id', true );
$user_id   = get_post_meta( $review_id, 'user_id', true );
$rating    = get_post_meta( $review_id, 'rating', true );

$user = get_user_by( 'id', $user_id );

$avatar_id = get_user_meta( $user->ID, 'avatar', true );
$avatar    = ! empty( $avatar_id ) ? wp_get_attachment_image_url( $avatar_id, 'avatar_small' ) : $avatar;

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