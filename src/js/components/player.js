(function ($) {
    $(document).ready(function () {
        checkFavorite();

        $('.add-favourite').on('click', addFavorite);
        $(window).on('setPlayerData', checkFavorite);

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
            const stream = $(this).siblings('.wp-radio-player-play-pause').attr('data-stream');

            if (!stream) return;

            const streamId = JSON.parse(stream).streamId;

            $.ajax({
                url: wpradio.ajaxUrl,
                data: {
                    action: 'add_favourites',
                    type,
                    id: streamId,
                },
                success: ({data}) => {
                    if (data) {
                        if ('add' === type) {
                            $this.addClass('added');
                        } else {
                            $this.removeClass('added');
                        }
                    }
                },

                error: error => console.log(error),

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

                    let stream = $('.wp-radio-player-play-pause', $this.parents('.wp-radio-player')).attr('data-stream');

                    if (!stream) return;

                    const id = JSON.parse(stream).streamId;

                    $.ajax({
                        url: wpradio.ajaxUrl,
                        data: {
                            action: 'check_favourite',
                            id,
                        },
                        success: ({data}) => {
                            if (data.added) {
                                $this.addClass('added');
                            } else {
                                $this.removeClass('added');
                            }
                        },
                        error: error => console.log(error)
                    });
                });

            }
        }
    });
})(jQuery);