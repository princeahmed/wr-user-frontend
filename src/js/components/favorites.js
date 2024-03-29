;(function ($) {
    const app = {

        init: function (e) {
            const isPjax = e.type === 'pjax:complete';
            //init update favorites
            app.updateFavorites();

            if (!isPjax) {
                $(document).on('click','.favorite-btn', app.toggleFavorite);
                wpRadioHooks.addAction('update_player_data', 'wp-radio', app.updateFavorites);
            }
        },

        toggleFavorite: function (e) {
            e.preventDefault();

            if (!parseInt(WRUF.currentUserID)) {
                Swal.fire({
                    title: `<a href="${WRUF.myAccountURL}">Login</a> first to add the station to your favorite list.`,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });

                return;
            }

            const id = $(this).attr('data-id');
            const isFavorite = $(this).hasClass('active');

            wp.ajax.send('wp_radio_toggle_favorite', {
                data: {
                    id: id,
                    type: isFavorite ? 'remove' : 'add',
                },
                success: function (favorites) {

                    if (typeof favorites === 'object') {
                        favorites = Object.values(favorites);
                    }

                    favorites = Array.isArray(favorites) ? favorites : [];

                    localStorage.setItem('favorite_stations', JSON.stringify(favorites));

                    //sweetalert toast
                    Swal.fire({
                        toast: true,
                        title: isFavorite ? 'Station removed from favorites.' : 'Station added to favorites',
                        icon: 'success',
                        timer: 2500,
                        position: 'bottom',
                        timerProgressBar: true,
                        showConfirmButton: false,
                    }).then(() => {
                        app.updateFavorites();
                    });

                },
                error: error => console.log(error),
            });

        },

        isFavorite: function (id) {
            return app.getFavorites().includes(parseInt(id));
        },

        getFavorites: () => {
            let favorites = localStorage.getItem('favorite_stations');
            if (!favorites) return [];

            favorites = JSON.parse(favorites);
            if (!Array.isArray(favorites)) return [];

            favorites = favorites.map(favorite => parseInt(favorite));
            return favorites;
        },

        updateFavorites: () => {
            $('.favorite-btn').each(function () {
                const id = $(this).attr('data-id');
                if (app.isFavorite(id)) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
        },
    }

    $(document).ready(app.init);
    $(document).on('pjax:complete', app.init);
})(jQuery);