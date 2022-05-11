;(function ($) {
    const app = {
        init: function () {

            // Handle review form submit
            $('#review_submit').on('click', app.handleSubmit);

            // Handle delete
            $('#delete_review').on('click', app.handleDelete);

            // Handle review selection
            $('.star').on('click', app.handleSelection);

        },

        handleDelete: function (e) {
            e.preventDefault();

            const reviewId = $(this).data('review_id');

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                reverseButtons: true,
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    $('#rating').val('');
                    $('#review').val('');
                    $('.star').removeClass('active');


                    wp.ajax.send('wp_radio_delete_review', {
                        data: {
                            id: reviewId
                        },
                        success: function (response) {
                        },
                        error: error => console.log(error),
                    });
                }
            }).then(({isConfirmed}) => {
                if (isConfirmed) {
                    Swal.fire({
                        title: `Your review has been deleted.`,
                        icon: 'success',
                        timer: 3000,
                        timerProgressBar: true,
                    }).then(() => {
                        $('.single-review.current-user-review').remove();
                    })
                }
            })


        },

        handleSubmit: function (e) {
            e.preventDefault();

            if (!parseInt(WRUF.currentUserID)) {
                Swal.fire({
                    title: `Please, <a href="${WRUF.myAccountURL}">login</a> first to add a review.`,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });

                return;
            }

            const object_id = $('#object_id').val();
            const rating = $('#rating').val();
            const review = $('#review').val();

            if (!rating) {
                Swal.fire({
                    title: 'Please, select the rating.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });

                return;
            }

            if (!review) {
                Swal.fire({
                    title: 'Please, write a review.',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });

                return;
            }

            wp.ajax.send('wp_radio_add_review', {
                data: {
                    object_id,
                    rating,
                    review,
                },
                success: function (response) {
                    Swal.fire({
                        title: `Your review has been ${response.update ? 'updated' : 'added'}.`,
                        icon: 'success',
                        timer: 3000,
                        timerProgressBar: true,
                    }).then(() => {
                        $('#no-review-msg').remove();
                        if (response.update) {
                            $('.single-review.current-user-review').remove();
                        }
                        $('.review-listing').append(response.html);
                    });
                },
                error: error => console.log(error),
            });

        },

        handleSelection: function () {
            $(this).addClass('active');
            $(this).prevAll().addClass('active');
            $(this).nextAll().removeClass('active');

            $('#rating').val($(this).data('rate'));
        },
    }

    $(document).ready(app.init);

})(jQuery);