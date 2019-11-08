(function ($) {
    $(document).ready(function () {
        initActiveTab();
        $(document).on('click', '.change-password-button', togglePassFields);
        $(document).on('click', '.to-dashboard, .to-favourites, .to-edit-account', setActiveTab);
        $(document).on('click', '#load_more_favourites', loadMoreFavorites);

        function togglePassFields() {
            $('.change-password-fields').toggle();
        }

        function setActiveTab(e) {
            e.preventDefault();

            let selectors = $(this);
            const target = $(this).attr('data-target');
            selectors = selectors.add(target);

            $('.wp-radio-my-account-content>div, .wp-radio-my-account-navigation>ul>li').removeClass('active');

            selectors.addClass('active');

            localStorage.setItem('wp_radio_myaccount_active_tab', target);
        }

        function initActiveTab() {
            const target = localStorage.getItem('wp_radio_myaccount_active_tab');

            if (target) {
                $(target).addClass('active');
                $(`li[data-target="${target}"]`).addClass('active');
            } else {
                $('.content-dashboard').addClass('active');
                $(`li[data-target=".content-dashbord"]`).addClass('active');
            }
        }

        function loadMoreFavorites(e) {
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
                    $this.text('No More Favorites!');
                    console.log(error);
                }
            });
        }

    });
})(jQuery);