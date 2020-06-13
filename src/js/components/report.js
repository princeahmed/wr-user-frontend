(function ($) {
    $(document).ready(function () {

        const selector = $('.report-form-wrapper');

        if (!selector.length) {
            return;
        }

        const closeForm = () => selector.removeClass('active');

        $(document).on('click', '.open-popup', setData);

        $(document).on('click', '.report-form', (e) => e.stopPropagation());

        $(document).on('click', '.report-close', closeForm);
        $(document).on('click', '.report-form-wrapper', closeForm);

        $(document).on('click', '.report-submit', ajaxSend);

        function setData() {

            selector.addClass('active');

            const $stream = JSON.parse(sessionStorage.getItem('stream'));

            const title = $(this).attr('data-name') !== undefined ? $(this).attr('data-name') : $stream.title,
                id = $(this).attr('data-id') !== undefined ? $(this).attr('data-id') : $stream.streamId;

            $('#report-radio').text(title);
            $('#report-radio-id').val(id);
        }

        function ajaxSend(e) {
            e.preventDefault();

            if($('#report-email').val() === '' || $('#report-message').val() === ''){
                $('#report-validation').fadeIn();
                return;
            }

            $(this).text(wpradio.i18n.sending);

            const data = $('.report-form').serialize();

            wp.ajax.send('send_report', {
                data: {
                    data,
                    nonce: wpradio.nonce
                },

                success: () => {
                    $('.report-form').addClass('submitted');
                    setTimeout(() => {
                        selector.removeClass('active');
                        $('.report-form').removeClass('submitted');
                        $(this).text(wpradio.i18n.sendMessage);
                        }, 3000);
                },

                error: (error) => console.log(error)
            });
        }


    })
})(jQuery);