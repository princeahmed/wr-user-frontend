<?php

defined( 'ABSPATH' ) || exit();


$country_terms = get_terms( [ 'taxonomy' => 'radio_country', 'parent' => 0 ] );
$genre_terms   = get_terms( [ 'taxonomy' => 'radio_genre', 'parent' => 0 ] );

$country_list = ! empty( $country_terms ) ? wp_list_pluck( $country_terms, 'name', 'slug' ) : [];
$genre_list   = ! empty( $genre_terms ) ? wp_list_pluck( $genre_terms, 'name', 'term_id' ) : [];

if ( is_user_logged_in() ) { ?>
    <div class="wp-radio-flex"
         id="submit-station"
         data-countries='<?php echo wp_radio_escape_quote( json_encode( $country_list ) ); ?>'
         data-genres='<?php echo wp_radio_escape_quote( json_encode( $genre_list ) ); ?>'
    ></div>
<?php } else { ?>
    <p>Please, <a href="<?php echo get_the_permalink( wp_radio_get_settings( 'account_page',
			get_option( 'wp_radio_account_page' ), 'wp_radio_user_frontend_settings' ) ); ?>">Login</a> to your account
        to submit a
        station.</p>

<?php }