(function ($) {
    $(document).ready(function () {

        checkAllFavorites();

        $(document).on('click', '.add-favourite', addFavorite);
        $(window).on('setPlayerData', checkAllFavorites);

        /**
         * Add selected station to favourites list
         */
        function addFavorite() {

            if ($(this).hasClass('disabled')) {
                alert(WRUF.i18n.loginAlert);
                return;
            }

            const $this = $(this);
            const type = $this.hasClass('added') ? 'remove' : 'add';

            let parent = null;
            if ($this.parents('.wp-radio-player').length) {
                parent = $this.parents('.wp-radio-player')
            } else if ($this.parents('.wp-radio-single').length) {
                parent = $this.parents('.wp-radio-single');
            } else if ($this.parents('.wp-radio-listing').length) {
                parent = $this.parents('.wp-radio-listing');
            }

            if (!parent) {
                return;
            }

            let stream = $('.wp-radio-player-play-pause', parent).attr('data-stream');

            const streamId = JSON.parse(stream).streamId;

            $.ajax({
                url: wpradio.ajaxUrl,
                data: {
                    action: 'add_favourites',
                    type,
                    id: streamId,
                },
                success: ({data}) => {

                    if (data.success) {
                        localStorage.setItem('favorite_stations', JSON.stringify(data.favorites));

                        checkAllFavorites();
                    }
                },

                error: error => console.log(error),

            });
        }

        function checkAllFavorites() {

            let favorites = localStorage.getItem('favorite_stations');
            if (!favorites) return;

            favorites = JSON.parse(favorites);
            if (!Array.isArray(favorites)) return;

            const favourite = $('.add-favourite');

            if (favourite.length) {
                favourite.each(function () {
                    const $this = $(this);

                    let parent = null;
                    if ($this.parents('.wp-radio-player').length) {
                        parent = $this.parents('.wp-radio-player')
                    } else if ($this.parents('.wp-radio-single').length) {
                        parent = $this.parents('.wp-radio-single');
                    } else if ($this.parents('.wp-radio-listing').length) {
                        parent = $this.parents('.wp-radio-listing');
                    }

                    if (!parent) {
                        return;
                    }

                    let stream = $('.wp-radio-player-play-pause', parent).attr('data-stream');

                    if (!stream) return;
                    stream = JSON.parse(stream);

                    const id = parseInt(stream.streamId);

                    const is_added = favorites.includes(id);

                    checkFavorite(id, is_added);

                });
            }
        }

        /**
         * Check if the selected station is in favourite list or not
         */
        function checkFavorite(id, is_added) {

            //player
            const player = $('#wp-radio-player');
            if (player.length) {
                let stream = $('.wp-radio-player-play-pause', player).attr('data-stream');

                if (stream) {
                    stream = JSON.parse(stream);

                    if (String(id) === String(stream.streamId)) {
                        if (is_added) {
                            $('.add-favourite', player).addClass('added');
                        } else {
                            $('.add-favourite', player).removeClass('added');
                        }
                    }
                }
            }

            //shortcode
            const shortcode_player = $(`#wp-radio-shortcode-player-${id}`);
            if (shortcode_player.length) {

                if (is_added) {
                    $('.add-favourite', shortcode_player).addClass('added');
                } else {
                    $('.add-favourite', shortcode_player).removeClass('added');
                }
            }

            //single
            const single_player = $(`#single-radio-${id}`);
            if (single_player.length) {
                if (is_added) {
                    $('.wp-radio-header .add-favourite', single_player).addClass('added');
                } else {
                    $('.wp-radio-header .add-favourite', single_player).removeClass('added');
                }
            }

            //listing
            const listing_player = $(`.wp-radio-listing-${id}`);
            if (listing_player.length) {
                if (is_added) {
                    $('.add-favourite', listing_player).addClass('added');
                } else {
                    $('.add-favourite', listing_player).removeClass('added');
                }
            }

        }

    });
})(jQuery);