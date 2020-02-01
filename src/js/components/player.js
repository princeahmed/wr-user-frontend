(function ($) {
    $(document).ready(function () {
        $('.add-favourite').on('click', addFavorite);
        $('#wp-radio-player').on('setPlayerData', checkFavorite);

        /**
         * Add selected station to favourites list
         */
        function addFavorite() {

            if ($(this).hasClass('disabled')) {
                alert(WRUF.i18n.loginAlert);
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


        /**
         * Check if the selected station is in favourite list or not
         */
        function checkFavorite() {

            const favourite = $('.wp-radio-player .add-favourite');

            if (favourite.length) {
                favourite.each(function () {
                    const $this = $(this);
                    const id = $this.parents('.wp-radio-player').attr('data-stream-id');

                    wp.ajax.send('check_favourite', {
                        data: {
                            id,
                        },
                        success: function (response) {
                            if (response.added) {
                                $this.addClass('added');
                            } else {
                                $this.removeClass('added');
                            }
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                });

            }
        }
    });
})(jQuery);