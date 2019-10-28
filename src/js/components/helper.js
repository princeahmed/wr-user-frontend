(function ($) {
    $(document).ready(function () {
        $(document).on('click', '#load_more_favourites', loadMoreFavourites);

        function loadMoreFavourites(e) {
            e.preventDefault();
            const $this = $(this);
            const offset = $(this).attr('data-offset');

            wp.ajax.send('load_more_favourites', {
                data: {
                    offset,
                },
                success: function (response) {
                    $('.wp-radio-favourites').append(response.html);
                    $this.attr('data-offset', offset + 15);
                },
                error: function (error) {
                    $this.text('No More Favourites!');
                    console.log(error);
                }
            });
        }

    });
})(jQuery);