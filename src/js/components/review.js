(function ($) {
    $(document).ready(function () {
        $(document).on('click', '.set-review-stars>.star', setReview);
        $(document).on('click', '#review_submit', submitReview);
        $(document).on('click', '.load-more-review', loadMoreReviews);

        function setReview() {
            let selectors = $(this);
            selectors = selectors.add(selectors.prevAll());
            const de_selectors = $(this).nextAll();

            selectors.addClass('dashicons-star-filled').removeClass('dashicons-star-empty');
            de_selectors.addClass('dashicons-star-empty').removeClass('dashicons-star-filled');

            $(this).parent().next().val($(this).attr('data-rate'));

        }

        function submitReview(e) {
            e.preventDefault();

            if ($(this).hasClass('disabled')) {
                alert('Please, Login to submit a review for this radio station.');
                return;
            }

            if ($('#rating').val() === '' || $('#review').val() === '') {
                $('.review-form-notices').addClass('error show').text('Please fill all the fields.');
                return;
            }

            const formData = $('#review-form').serialize();

            wp.ajax.send('submit_review', {
                data: {
                    formData,
                    nonce: wpradio.nonce
                },
                success: function (response) {
                    if (response.update || $('.review-listing>.current-user-review').length) {
                        $('.review-listing>.current-user-review').replaceWith(response.html);
                    } else {
                        const title = $('.review-listing>h3');
                        if (title.length) {
                            title.after(response.html);
                        } else {
                            $('.review-listing').append(response.html);
                        }
                    }
                    $('.review-form-notices').addClass('success show').text('Your review have been submitted.');
                },
                error: function (error) {
                    console.log(error);
                },
            });
        }

        function loadMoreReviews(e) {
            e.preventDefault();
            const $this = $(this);
            const offset = $(this).attr('data-offset');

            wp.ajax.send('load_more_reviews', {
                data: {
                    offset,
                },
                success: function (response) {
                    $('.review-listing').append(response.html);
                    $this.attr('data-offset', offset + 10);
                },
                error: function (error) {
                    $this.text('No More Reviews!');
                    console.log(error);
                }
            });
        }

    });
})(jQuery);