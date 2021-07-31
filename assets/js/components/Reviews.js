import classNames from "classnames";

const {TextareaControl, Spinner, Notice} = wp.components;

const {useState, useEffect, useRef} = wp.element;

export default function Reviews({data: {id, title}}) {

    const userID = WRUF.currentUserID;

    const [reviews, setReviews] = useState(null);
    const [userReview, setUserReview] = useState(null);
    const [selection, setSelection] = useState(userReview ? userReview.rating : 0);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef();

    function getReviews() {
        wp.apiFetch({
            path: `wp-radio/v1/reviews/?post_id=${id}`
        }).then(({data}) => {
            setReviews(data);
        });
    }

    function getUserReview() {
        wp.apiFetch({
            path: `wp-radio/v1/user-review/?post_id=${id}`
        }).then(({data}) => {
            setUserReview(data);
        });
    }

    useEffect(() => {
        getReviews();
        getUserReview();
    }, [id]);

    const onHover = (key) => {
        setSelection(key);
    }

    const onClick = (key) => {
        setUserReview({...userReview, rating: key});
    }

    const onSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        const requires = {
            rating: `<strong>Review Rating</strong>`,
            content: `<strong>Review Description</strong>`,
        }

        const checkErrors = [];
        Object.keys(requires).map(key => {

            if (!userReview[key] || userReview[key] === '') {
                checkErrors.push(`${requires[key]} is a required.`);
            }
        })


        if (checkErrors.length) {
            setLoading(false);
            setErrors(checkErrors);

            formRef.current.scrollIntoView({
                behavior: 'smooth'
            });

            return;
        }

        wp.apiFetch({
            method: 'POST',
            path: `wp-radio/v1/user-review/?post_id=${id}`,
            data: userReview
        }).then((success, data) => {
            setLoading(false);

            if (!success) {
                setErrors(data);
            }

            setSubmitted(true);

            formRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    return (
        <>
            {!!reviews && !!reviews.length &&
            <div className="review-listing">
                <h3 className="review-listing-title">What Others Say about {title}</h3>

                {
                    reviews.map(({avatar, name, rating, date, content}) => {

                        return (
                            <div className="single-review">
                                <div className="reviewer-avatar"
                                     dangerouslySetInnerHTML={{__html: avatar}}
                                >
                                </div>

                                <div className="reviewer-name">
                                    <span>{name}</span>
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
                    })
                }

            </div>
            }

            <form ref={formRef} className="wp-radio-form review-form" onSubmit={onSubmit}>
                <h3 className="review-section-title">Leave a Review</h3>

                {!!errors &&
                <div className="wp-radio-notice-list">
                    {
                        errors.map(content => (
                            <Notice
                                status="error"
                                isDismissible
                                onRemove={() => setErrors(errors.filter(text => text !== content))}
                            >
                                <span dangerouslySetInnerHTML={{__html: content}}></span>
                            </Notice>
                        ))
                    }
                </div>
                }

                {submitted &&
                <div className="wp-radio-notice-list">
                    <Notice
                        status="success"
                        onRemove={() => setSubmitted(false)}
                    >
                        Your review is successfully added.
                    </Notice>
                </div>
                }

                <p className="wp-radio-form-row wp-radio-form-row--wide set-review">
                    <label htmlFor="rating">Set your rating:</label>

                    <span className="set-review-stars" onMouseOut={() => userReview && setSelection(userReview.rating)}>
                        {
                            [1, 2, 3, 4, 5].map(key => {
                                let icon = 'empty';

                                if (selection) {
                                    if (key <= selection) {
                                        icon = 'filled';
                                    }
                                } else if (userReview) {
                                    if (key <= userReview.rating) {
                                        icon = 'filled';
                                    }
                                }

                                return (<i
                                    className={`dashicons star dashicons-star-${icon}`}
                                    onMouseOver={() => onHover(key)}
                                    onClick={() => onClick(key)}
                                > </i>)
                            })
                        }
                    </span>
                </p>

                <p className="wp-radio-form-row wp-radio-form-row--wide">
                    <label htmlFor="review">Your Review:</label>
                    <TextareaControl
                        rows={3}
                        value={userReview && userReview.content}
                        onChange={content => setUserReview({...userReview, content})}
                    />
                </p>

                <p className="wp-radio-form-row">
                    <button
                        type="submit"
                        className={classNames("wp-radio-button button", {disabled: !!userID})}>
                        {userReview ? 'Update' : 'Submit'}
                        {loading && <Spinner/>}
                    </button>
                </p>

            </form>
        </>
    )
}