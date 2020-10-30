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

            $('img', $(this)).show();

            const $this = $(this);
            const offset = $(this).attr('data-offset');

            $.ajax({
                url: wpradio.ajaxUrl,
                data: {
                    action: 'load_more_favourites',
                    offset,
                },
                success: ({data}) => {
                    if (data && data.html) {
                        $('.wp-radio-favourites').append(data.html);
                        $this.attr('data-offset', offset + 15);
                    } else {
                        $this.text('No More Favorites!');
                    }
                },
                error: error => {
                    $this.text('No More Favorites!');
                    console.log(error);
                },
                
                complete: () => {
                    $('img', $(this)).hide();
                }
            });
        }

    });
})(jQuery);