;(function ($) {
    const app = {
        init: () => {
            $(document).on('click', '.share-btn', app.openShare);
            $(document).on('click', '.share-item.embed', app.handleEmbed);
            $(document).on('click', '.share-item.link', app.copyLink);
            $(document).on('focus', '.embed-code textarea', app.copyEmbedCode);
            $(document).on('click', '.embed-code button', app.copyEmbedCode);
        },

        openShare: function(e) {
            e.preventDefault();

            const data = $(this).data('station');
            const {id, link, title} = data;

            Swal.fire({
                title: 'Share',
                html: `
                    <div class="embed-code">
                        <textarea readonly><iframe src="${wpRadio.popupURL}/wp-radio/?player=popup&station_id=${id}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></textarea>
                        
                        <button type="submit" class="wp-radio-button">Copy Code</button>
                    </div>

                    <div class="share-links">
                    
                        <div class="share-item link">
                            <i class="dashicons dashicons-admin-links"></i>
                            <span>Copy link</span>
                            <input type="text" value="${link}" readonly>
                        </div>
                        
                        <div class="share-item embed">
                            <i class="dashicons dashicons-editor-code"></i>
                            <span>Embed</span>
                        </div>
                            
                        <a class="share-item facebook" href="https://www.facebook.com/sharer/sharer.php?u=${link}" target="_blank">
                            <i class="dashicons dashicons-facebook"></i>
                            <span>Facebook</span>
                        </a>
                        
                        <a class="share-item twitter" href="https://twitter.com/intent/tweet?text=${title} Listen Live &url=${link}" target="_blank" >
                            <i class="dashicons dashicons-twitter"></i>
                            <span>Twitter</span>
                        </a>
                        
                        <a class="share-item whatsapp" href="https://wa.me/?text=${link}" target="_blank" >
                            <i class="dashicons dashicons-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>
                        
                    </div>
                `,
                showCloseButton: true,
                showConfirmButton: false,
                showCancelButton: false,
                customClass: 'share-modal',
            })
        },

        handleEmbed: () => {
            const modal = $('.share-modal');
            modal.addClass('embed');
            modal.find('.swal2-title').text('Embed Player');
        },

        copyLink: function () {
            $(this).find('input').select();
            document.execCommand('copy');
            Swal.fire({
                title: 'Link copied to clipboard',
                icon: 'success',
                showConfirmButton: false,
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                position: 'center',
            });
        },

        copyEmbedCode: () => {
            $('.embed-code textarea').select();
            document.execCommand('copy');

            setTimeout(() => {
                Swal.fire({
                    title: 'Embed code copied to clipboard',
                    icon: 'success',
                    showConfirmButton: false,
                    toast: true,
                    timer: 2000,
                    timerProgressBar: true,
                    position: 'center',
                })
            }, 500);
        },
    }

    $(document).ready(app.init);
})(jQuery);