import FavoriteBtn from "./FavoriteBtn";
import ReportBtn from "./ReportBtn";
import Review from "./Review";

function Hooks() {

    //favorite btn
    window.wpRadioHooks.addAction('playBtn', 'wp-radio', (parent, id) => {

        if (!parent) return;

        const btn = document.createElement('span');
        btn.classList.add('favorite-btn-wrap')
        wp.element.render(<FavoriteBtn/>, btn)

        parent.prepend(btn);

        if (parent.classList.contains('wp-radio-player-controls')) {
            const btn = document.createElement('span');
            btn.classList.add('report-btn-wrap')
            wp.element.render(<ReportBtn isMinimal/>, btn)

            parent.append(btn);
        }

    });


    window.wpRadioHooks.addAction('singleRadio', 'wp-radio', (parent, info, contacts, id) => {

        //report btn
        const reportBtn = document.createElement('span');
        reportBtn.classList.add('report-btn-wrap')
        wp.element.render(<ReportBtn/>, reportBtn)

        info.append(reportBtn);

        //review
        const review = document.createElement('span');
        review.classList.add('wp-radio-review-wrap')
        wp.element.render(<Review/>, review)

        parent.insertBefore(review, contacts.nextSibling);
    });

}

Hooks()