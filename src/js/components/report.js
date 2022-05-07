;(function ($) {
    const app = {
        init: function () {
            $('.report-btn').on('click', app.HandleReport);
        },

        HandleReport: function (e) {
            e.preventDefault();

            const $this = $(this);
            const {id, title, link, thumbnail} = $(this).data('station');

            Swal.fire({
                title: 'Report a problem with station',
                confirmButtonText: 'Submit report',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                cancelButtonColor: '#d33',
                reverseButtons: true,
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    const email = $('#report-email').val();
                    const issue = $('#report-issue').val();
                    const message = $('#report-message').val();

                    //check empty any field
                    if (email === '') {
                        Swal.showValidationMessage('Email is missing!')
                        return;
                    }

                    if (issue === '') {
                        Swal.showValidationMessage('No issue is selected!')
                        return;
                    }


                    wp.ajax.send('wp_radio_report', {
                        data: {
                            id: id,
                            email: email,
                            issue: issue,
                            message: message,
                        },
                        error: error => console.log(error),
                    })

                },
                html:
                    `
                    <form id="report-form">
                    
                        <div class="selected-station">
                            <img src="${thumbnail}" alt="${title}" />
                            <a href="${link}">${title}</a>
                        </div>
                        
                        <div class="form-group">
                            <label for="report-email">Your Email: <span class="required">*</span></label>
                            <input type="email" id="report-email" name="email" />
                        </div>
                        
                        <div class="form-group">
                            <label for="report-issue">Select Issue: <span class="required">*</span></label>
                            <select name="issue" id="report-issue" required>
                                <option value="">Select the issue</option>
                                <option>The page is not working</option>
                                <option>Playback is not working</option>
                                <option>Address or radio data is incorrect</option>
                                <option>The site is using an incorrect stream link</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="report-email">Your Message:</label>
                            <textarea name="message" id="report-message" rows="4" cols="30"></textarea>
                        </div>
                        
                        <input type="hidden" name="station-id" value="${id}">                       
                    </form>
                    `
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Report sent successfully!',
                        icon: 'success',
                        timer: 2500,
                        timerProgressBar: true,
                    });
                }
            })
        }
    }

    $(document).ready(app.init);
    $(document).on('pjax:complete', app.init);

})(jQuery);