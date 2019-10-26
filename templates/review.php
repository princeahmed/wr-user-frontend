<?php

defined( 'ABSPATH' ) || exit();

?>

<h3 class="review-section-title">Leave a Review</h3>

<form action="" class="wp-radio-form review-form" id="review-form">
    <p class="wp-radio-form-row wp-radio-form-row--wide set-review">
        <label for="rating"><?php esc_html_e( 'Set your rating:', 'wp-radio' ); ?></label>
        <span class="set-review-stars">
			<i class="dashicons dashicons-star-empty star" data-rate="1"></i>
			<i class="dashicons dashicons-star-empty star" data-rate="2"></i>
			<i class="dashicons dashicons-star-empty star" data-rate="3"></i>
			<i class="dashicons dashicons-star-empty star" data-rate="4"></i>
			<i class="dashicons dashicons-star-empty star" data-rate="5"></i>
		</span>
        <input type="hidden" name="rating" id="rating"/>
    </p>

    <p class="wp-radio-form-row wp-radio-form-row--wide">
        <label for="review"><?php esc_html_e( 'Your Review:', 'wp-radio' ); ?></label>
        <textarea name="review" id="review" placeholder="Your Review" rows="5"></textarea>
    </p>

    <!--Submit-->
    <p class="wp-radio-form-row">
        <button type="submit" class="wp-radio-button button" name="submit" id="review_submit"><?php esc_attr_e( 'Submit', 'wp-radio' ); ?></button>
    </p>

</form>

<div class="review-listing">
    <h3 class="review-listing-title">What Others Say about Radio Foorti:</h3>
    <div class="single-review">
        <div class="reviewer-avatar">
            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEHBg4NBxESEA4PFgoOFBQSGQ8QEQ8SIBEiIhQdHxMYHCgsGCYxHR8fIzEtMSk3OjouIyszOD8tNzQ5Oi0BCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAIAAgAMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwUGBAIB/8QANRAAAgEDAAYGCAcBAAAAAAAAAAECAwQRBRIhMUFREyJhcYHBBhQjcpGhotEyM0JSYrGyJP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDegAAAAAAAAAAAAAAAAAAAAAAAAAAAeoQc5KMFlvZhAeQXlnodRWtdbX+1bl48Szp0Y0l7OKXckgMgDYVKUaq9pFS70mVt3oeM1m26suTzqv7AUIPdWm6U3GosNcDwAAAAAAAAAAAA0WibL1elrz/HL6VyKfRlHpr2Ke5dZ+BqgAAAAADg0nZK6pZiuvHOHz7DNNYe02hmdM0eivnjdLEvuBwgAAAAAAAAACz9H1/2y92X+kaEzGh6vRX8c7pa0fkacAAAAAAFD6Q/nw7pf2Xxm9OVNe+wv0qMfPzArwAAAAAAAAAB9T1Xlb9hqLC6V3QUv1LCkuTMsT2dxO3rJ0drezG163gBrQQ0JupTUpxcXyeMkwAAirT6Om5KLljgsZYHi8uFa0HOXDcubMrObqTcp7W22/jtJ7+5ncVvbbMZ6u3Z4M5gAAAAAAAAAB36KsfWqmtU/BHGf5PkB80fo6V29aXVhz59yL63tYW0cUo47eL8SaMVFYjsSwj0AAAAAAQXNtC5hirFPt4rx4FBpDRsrXrQ60OfGPejTHmUVJYltTygMaCw0rYeqz1qf5b+l8ivAAAAAAJKFJ160YQ3yaX3NVb0VQoqENy2FT6P0MzlUfDqrzLwAAAAAAAAAAAIq9JVqThPdLKMpcUXQrShLfFtd/I2BSekFDbCqvdfl5gUwAAAADT6Jp9HYQ7cy+LO0jt46lCC5KK+RIAAAAAAAAAAAA49KU+lsJrknL4bTsI6q16UlzUl8gMeAAP/2Q==" alt="" width="32" height="32">
        </div>
        <div class="reviewer-name">
            <span>Prince Ahmed</span>
        </div>
        <div class="reviewer-rating">
            <i class="dashicons dashicons-star-empty" data-rate="1"></i>
            <i class="dashicons dashicons-star-empty" data-rate="2"></i>
            <i class="dashicons dashicons-star-empty" data-rate="3"></i>
            <i class="dashicons dashicons-star-empty" data-rate="4"></i>
            <i class="dashicons dashicons-star-empty" data-rate="5"></i>
        </div>
        <div class="review-date">
            <span>27-12-1999</span>
        </div>

        <div class="review-comments">
            <p>Listening Tigers from you in our vernacular!</p>
        </div>

    </div>
    <div class="single-review">
        <div class="reviewer-avatar">
            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEHBg4NBxESEA4PFgoOFBQSGQ8QEQ8SIBEiIhQdHxMYHCgsGCYxHR8fIzEtMSk3OjouIyszOD8tNzQ5Oi0BCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAIAAgAMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwUGBAIB/8QANRAAAgEDAAYGCAcBAAAAAAAAAAECAwQRBRIhMUFREyJhcYHBBhQjcpGhotEyM0JSYrGyJP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDegAAAAAAAAAAAAAAAAAAAAAAAAAAAeoQc5KMFlvZhAeQXlnodRWtdbX+1bl48Szp0Y0l7OKXckgMgDYVKUaq9pFS70mVt3oeM1m26suTzqv7AUIPdWm6U3GosNcDwAAAAAAAAAAAA0WibL1elrz/HL6VyKfRlHpr2Ke5dZ+BqgAAAAADg0nZK6pZiuvHOHz7DNNYe02hmdM0eivnjdLEvuBwgAAAAAAAAACz9H1/2y92X+kaEzGh6vRX8c7pa0fkacAAAAAAFD6Q/nw7pf2Xxm9OVNe+wv0qMfPzArwAAAAAAAAAB9T1Xlb9hqLC6V3QUv1LCkuTMsT2dxO3rJ0drezG163gBrQQ0JupTUpxcXyeMkwAAirT6Om5KLljgsZYHi8uFa0HOXDcubMrObqTcp7W22/jtJ7+5ncVvbbMZ6u3Z4M5gAAAAAAAAAB36KsfWqmtU/BHGf5PkB80fo6V29aXVhz59yL63tYW0cUo47eL8SaMVFYjsSwj0AAAAAAQXNtC5hirFPt4rx4FBpDRsrXrQ60OfGPejTHmUVJYltTygMaCw0rYeqz1qf5b+l8ivAAAAAAJKFJ160YQ3yaX3NVb0VQoqENy2FT6P0MzlUfDqrzLwAAAAAAAAAAAIq9JVqThPdLKMpcUXQrShLfFtd/I2BSekFDbCqvdfl5gUwAAAADT6Jp9HYQ7cy+LO0jt46lCC5KK+RIAAAAAAAAAAAA49KU+lsJrknL4bTsI6q16UlzUl8gMeAAP/2Q==" alt="" width="32" height="32">
        </div>
        <div class="reviewer-name">
            <span>Prince Ahmed</span>
        </div>
        <div class="reviewer-rating">
            <i class="dashicons dashicons-star-empty" data-rate="1"></i>
            <i class="dashicons dashicons-star-empty" data-rate="2"></i>
            <i class="dashicons dashicons-star-empty" data-rate="3"></i>
            <i class="dashicons dashicons-star-empty" data-rate="4"></i>
            <i class="dashicons dashicons-star-empty" data-rate="5"></i>
        </div>
        <div class="review-date">
            <span>27-12-1999</span>
        </div>

        <div class="review-comments">
            <p>Listening Tigers from you in our vernacular!</p>
        </div>

    </div>
</div>

<p class="more-review">
    <button class="more-review-btn button">Load More Reviews</button>
</p>
