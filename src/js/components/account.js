(function ($) {
    $(document).ready(function () {
        initActiveTab();
        $(document).on('click', '.change-password-button', togglePassFields);
        $(document).on('click', 'li.dashboard, li.favourites, li.edit-account', setActiveTab);

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
            } else {
                $('.content-dashboard').addClass('active');
            }
        }

    });
})(jQuery);