import icons from './icons.json'

const {TextControl, SelectControl, TextareaControl} = wp.components;

const {useState} = wp.element;

export default function ReportBtn({isMinimal, data: {id, title}}) {

    const text = isMinimal ? '' : `<span>Report a problem</span>`;

    const [formData, setFormData] = useState({id, email: '', issue: '', message: ''});
    const [active, setActive] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();

        wp.apiFetch({
            method: 'POST',
            path: `wp-radio/v1/report`,
            data: formData
        });

        setActive(false);
        setSubmitted(true);

    }

    return (
        <>
            <button
                type="button"
                className="report-btn"
                dangerouslySetInnerHTML={{__html: `${icons.report} ${text}`}}
                onClick={() => setActive(!active)}
            >
            </button>

            {active &&
            <div id="report-form-wrapper" className="report-form-wrapper">
                <form className="report-form" onSubmit={handleSubmit}>

                    <i className="dashicons dashicons-dismiss report-close"
                       onClick={() => setActive(false)}
                    ></i>

                    <div className="report-before">
                        <h4 className="form-title">Report a Problem with Station:</h4>

                        <div id="report-validation" className="report-validation">Please, Fill out all the fields.</div>

                        <div className="wp-radio-form-row report-email-field">
                            <TextControl
                                label="Your Email:"
                                value={formData.email}
                                type="email"
                                onChange={(email) => setFormData({...formData, email})}
                            />
                        </div>

                        <div className="wp-radio-form-row issue-field">
                            <SelectControl
                                label="Select issue"
                                value={formData.issue}
                                onChange={issue => setFormData({...formData, issue})}
                                options={[
                                    {value: '', label: 'Select issue', disabled: true},
                                    {value: 'The page is not working', label: 'The page is not working'},
                                    {value: 'Playback is not working', label: 'Playback is not working'},
                                    {
                                        value: 'Address or radio data is incorrect',
                                        label: 'Address or radio data is incorrect'
                                    },
                                    {
                                        value: 'The site is using an incorrect stream link',
                                        label: 'The site is using an incorrect stream link'
                                    },
                                ]}
                            />

                        </div>

                        <div className="wp-radio-form-row report-message-field">
                            <TextareaControl
                                label="Your Message:"
                                rows={3}
                                value={formData.message}
                                onChange={message => setFormData({...formData, message})}
                            />
                        </div>

                        <div className="wp-radio-form-row report-radio-field">
                            <span>Radio Station:</span>
                            <a href="#" className="report-radio" id="report-radio">{title}</a>
                        </div>

                        <div className="wp-radio-form-row report-submit-field">
                            <button type="submit" aria-label="Submit" title="Submit"
                                    className="button report-submit">Send Message
                            </button>
                        </div>

                    </div>
                </form>

                {submitted &&
                <div className="report-after">
                    <h3 className="confirm-message">Your message has been sent.</h3>
                </div>
                }

            </div>
            }

        </>
    )
}