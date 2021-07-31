<?php

defined( 'ABSPATH' ) || exit();


$country_terms = get_terms( [ 'taxonomy' => 'radio_country', 'parent' => 0 ] );
$genre_terms   = get_terms( [ 'taxonomy' => 'radio_genre', 'parent' => 0 ] );

$country_list = ! empty( $country_terms ) ? wp_list_pluck( $country_terms, 'name', 'slug' ) : [];
$genre_list   = ! empty( $genre_terms ) ? wp_list_pluck( $genre_terms, 'name', 'term_id' ) : [];

?>

<div class="wp-radio-flex"
     id="submit-station"
     data-countries='<?php echo wp_radio_escape_quote( json_encode( $country_list ) ); ?>'
     data-genres='<?php echo wp_radio_escape_quote( json_encode( $genre_list ) ); ?>'
></div>
