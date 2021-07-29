import classNames from "classnames";

const {TextareaControl} = wp.components;

export default function Review() {

    const title = 'WP Radio'
    const reviews = [
        {avatar: '', userName: 'Prince Ahmed', rating: 4, date: '12 July, 2021', content: 'Wow'}
    ]

    const userRating = {
        rating: 4,
        content: 'Nice'
    };
    const userID = 1;
    const id = 137;

    return (
        <>
            <div className="review-listing">
                <h3 className="review-listing-title">What Others Say about {title}</h3>

                {reviews.map(({avatar, userName, rating, date, content}) => {

                    return (
                        <div className="single-review">
                            <div className="reviewer-avatar">
                                <img src={avatar} alt={userName} width="32" height="32"/>
                            </div>

                            <div className="reviewer-name">
                                <span>{userName}</span>
                            </div>

                            <div className="reviewer-rating">
                                {
                                    [1, 2, 3, 4, 5].map(key => {
                                        const icon = key <= rating ? 'filled' : 'empty'

                                        return <i className={`dashicons star dashicons-star-${icon}`}></i>
                                    })
                                }
                            </div>

                            <div className="review-date">
                                <span>{date}</span>
                            </div>

                            <div className="review-comments">
                                <p>{content}</p>
                            </div>

                        </div>
                    )
                })}

            </div>

            <form className="wp-radio-form review-form" id="review-form">
                <h3 className="review-section-title">Leave a Review</h3>
                <div className="review-form-notices"></div>

                <p className="wp-radio-form-row wp-radio-form-row--wide set-review">
                    <label htmlFor="rating">Set your rating:</label>
                    <span className="set-review-stars">
                        {
                            [1, 2, 3, 4, 5].map(key => {
                                const icon = userRating && key <= userRating.rating ? 'filled' : 'empty'

                                return <i className={`dashicons star dashicons-star-${icon}`}></i>
                            })
                        }
                    </span>
                </p>

                <p className="wp-radio-form-row wp-radio-form-row--wide">
                    <label htmlFor="review">Your Review:</label>
                    <TextareaControl
                        rows={3}
                        value={userRating.content}
                        onChange={e => console.log(e)}
                    />
                </p>

                <p className="wp-radio-form-row">
                    <button
                        type="button"
                        className={classNames("wp-radio-button button", {disabled: !!userID})}>
                        {userRating ? 'Update' : 'Submit'}
                    </button>
                </p>

            </form>
        </>
    )
}