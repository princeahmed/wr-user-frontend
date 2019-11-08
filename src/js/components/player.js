(function ($) {
    $(document).ready(function () {
        $('.add-favourite').on('click', addFavorite);
        $('#wp-radio-player').on('setPlayerData', checkFavorite);

        function addFavorite() {

            if ($(this).hasClass('disabled')) {
                alert('Please, Login to add this station to your favourite list.');
                return;
            }

            const $this = $(this);
            const type = $(this).hasClass('added') ? 'remove' : 'add';
            const id = $(this).parents('.wp-radio-player').attr('data-stream-id');

            wp.ajax.send('add_favourites', {
                data: {
                    type,
                    id,
                },
                success: function (response) {
                    if (response) {
                        if ('add' === type) {
                            $this.addClass('added');
                        } else {
                            $this.removeClass('added');
                        }
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }

        function checkFavorite() {

            const favourite = $('.wp-radio-player .add-favourite');

            if (favourite.length) {
                const id = favourite.parents('.wp-radio-player').attr('data-stream-id');

                wp.ajax.send('check_favourite', {
                    data: {
                        id,
                    },
                    success: function (response) {
                        if (response.added) {
                            favourite.addClass('added');
                        } else {
                            favourite.removeClass('added');
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }
        }
    });
})(jQuery);