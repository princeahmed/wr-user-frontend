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

            const player = $(this).parents('.wp-radio-player');
            let stream = $('.wp-radio-player-play-pause', player).attr('data-stream');
            if (stream) {
                stream = JSON.parse(stream);
            }

            const title = typeof $(this).attr('data-name') !== 'undefined' ? $(this).attr('data-name') : stream.title,
                id = typeof $(this).attr('data-id') !== 'undefined' ? $(this).attr('data-id') : stream.streamId;

            $('#report-radio').text(title);
            $('#report-radio-id').val(id);
        }

        function ajaxSend(e) {
            e.preventDefault();

            if ($('#report-email').val() === '' || $('#issue').val() === '') {
                $('#report-validation').fadeIn();
                return;
            }

            $(this).text(wpradio.i18n.sending);

            const data = $('.report-form').serialize();


            $.ajax({
                url: wpradio.ajaxUrl,

                data: {
                    action: 'send_report',
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

                error: error => console.log(error)
            });
        }


    })
})(jQuery);