import FavoriteBtn from "./FavoriteBtn";
import ReportBtn from "./ReportBtn";
import Reviews from "./Reviews";

function Hooks() {

    //favorite btn
    window.wpRadioHooks.addAction('playBtn', 'wp-radio', (parent, data) => {

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
        if (parent.classList.contains('wp-radio-player-controls')) {
            let reportBtnElement = parent.querySelector('.report-btn-wrap');

            if (!reportBtnElement) {
                reportBtnElement = document.createElement('span');
                reportBtnElement.classList.add('report-btn-wrap')
            }

            wp.element.render(<ReportBtn isMinimal data={data}/>, reportBtnElement)
            parent.append(reportBtnElement);
        }

    });


    window.wpRadioHooks.addAction('singleRadio', 'wp-radio', (parent, info, contacts, data) => {

        //report btn
        const reportBtn = document.createElement('span');
        reportBtn.classList.add('report-btn-wrap')
        wp.element.render(<ReportBtn data={data}/>, reportBtn)

        info.append(reportBtn);

        //reviews
        const reviews = document.createElement('span');
        reviews.classList.add('wp-radio-review-wrap')
        wp.element.render(<Reviews data={data}/>, reviews)

        parent.insertBefore(reviews, contacts.nextSibling);
    });

}

Hooks()