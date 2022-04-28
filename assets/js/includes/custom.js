;(function ($) {
    $(document).on('ready', function () {

        //handle my-account
        $('.wp-radio-my-account-navigation a[href=#]').on('click', function (e) {
            e.preventDefault();

            const target = $(this).data('target');
            $('.wp-radio-my-account-navigation a').removeClass('active');
            $(this).addClass('active');

            $('.account-content').removeClass('active');
            $(`.content-${target}`).addClass('active');
        });

        // Password fields toggle
        $('.change-password-button').on('click', function (e) {
            e.preventDefault();

            $('.change-password-fields').toggleClass('active');
        });

        // Handle edit-account form
        $('.wp-radio-form-edit-account').on('submit', function (e) {
            e.preventDefault();

            const form = $(this);
            const data = form.serialize();

            const form_message = form.find('.form-message');

            form_message.html('');

            wp.ajax.send('wp_radio_edit_account', {
                data: {
                    data
                },
                success: function (response) {
                    if (response.success) {
                        form_message.html(`<p class="success">${response.success}</p>`);
                    }
                },
                error: error => {
                    if (Array.isArray(error)) {
                        error.forEach(error => {
                            form_message.append(`<p class="error">${error}</p>`);
                        });
                    } else {
                        console.log(error);
                    }
                },
            });

        });

        // Handle station submission form


    });
})(jQuery);