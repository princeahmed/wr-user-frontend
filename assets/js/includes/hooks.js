import FavoriteBtn from "../components/FavoriteBtn";
import ReportBtn from "../components/ReportBtn";
import Reviews from "../components/Reviews";
import ReportModal from "../components/ReportModal";

(function () {

    // Favorite btn
    window.wpRadioHooks.addAction('playBtn', 'wp-radio', (parent, data, playerType) => {

        if (!parent) return;

        //prepend favorite button
        let favBtnElement = parent.querySelector('.favorite-btn-wrap');

        if (!favBtnElement) {
            favBtnElement = document.createElement('span');
            favBtnElement.classList.add('favorite-btn-wrap')
        }

        wp.element.render(<FavoriteBtn id={data.id}/>, favBtnElement);
        parent.prepend(favBtnElement);

        //append report btn to the player controls
        if (WRUF.enableReport) {
            if ('popup' != playerType && parent.classList.contains('wp-radio-player-controls')) {
                let reportBtnElement = parent.querySelector('.report-btn-wrap');

                if (!reportBtnElement) {
                    reportBtnElement = document.createElement('span');
                    reportBtnElement.classList.add('report-btn-wrap')
                }

                wp.element.render(<ReportBtn isMinimal data={data}/>, reportBtnElement)
                parent.append(reportBtnElement);
            }
        }

    });

    // Handle Report Button
    window.wpRadioHooks.addAction('showReportModal', 'wp-radio', ($this, data) => {
        const element = document.createElement('div');
        wp.element.render(<ReportModal {...data} element={element}/>, element);

        $this.append(element);
    });

    // Single page hooks
    window.wpRadioHooks.addAction('single', 'wp-radio', (data) => {
        const reviewsElement = document.querySelector('.wp-radio-single .reviews-wrapper');
        if (reviewsElement) {
            wp.element.render(<Reviews data={data}/>, reviewsElement);
        }
    });

})();