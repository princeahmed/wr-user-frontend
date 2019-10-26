(function ($) {
    $(document).ready(function () {
        $(document).on('hover', '.set-review-stars>.star', setReview);
        $(document).on('click', '.set-review-stars>.star', setReview);

        $(document).on('click', '#review_submit', submitReview);

        function setReview() {
            let selectors = $(this);
            selectors = selectors.add(selectors.prevAll());
            const de_selectors = $(this).nextAll();

            selectors.addClass('dashicons-star-filled').removeClass('dashicons-star-empty');
            de_selectors.addClass('dashicons-star-empty').removeClass('dashicons-star-filled');

            $(this).parent().next().val($(this).attr('data-rate'));

        }

        function submitReview() {
            const data = $('#review-form').serialize();

            wp.ajax.send('submit_review', {
                data,
                success: function (response) {

                },
                error: function (error) {
                    console.log(error);
                },
            });
        }

    });
})(jQuery);