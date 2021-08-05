import icons from './icons.json'

const {TextControl, SelectControl, TextareaControl, Modal, Notice, Spinner} = wp.components;

const {useState} = wp.element;

export default function ReportBtn({isMinimal, data: {id, title}}) {

    const text = isMinimal ? '' : `<span>Report a problem</span>`;

    const [formData, setFormData] = useState({id, email: '', issue: '', message: ''});
    const [active, setActive] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const requires = {
            email: `<strong>Email</strong>`,
            issue: `<strong>Issue</strong>`,
            message: `<strong>Message</strong>`,
        }

        const checkErrors = [];
        Object.keys(requires).map(key => {
            if (!formData[key] || formData[key] === '') {
                checkErrors.push(`${requires[key]} is a required.`);
            }
        })


        if (checkErrors.length) {
            setLoading(false);
            setErrors(checkErrors);

            return;
        }

        wp.apiFetch({
            method: 'POST',
            path: `wp-radio/v1/report`,
            data: formData
        }).then(({success, data}) => {

            if (!success) {
                setErrors(data);
            }

            setErrors(null);
            setLoading(false);
            setSubmitted(true);

            setTimeout(() => {
                setActive(false);
                setSubmitted(false);
            }, 3000);
        });

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
            <Modal
                title={submitted ? 'Your report successfully send.' : 'Report a Problem with Station:'}
                className="report-form"
                onRequestClose={() => {
                    setActive(false)
                    setSubmitted(false)
                }}
                overlayClassName="report-form-overlay"
            >
                {!!errors && !!errors.length &&
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

                {submitted ||
                <form onSubmit={handleSubmit}>

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
                            {loading && <Spinner/>}
                        </button>
                    </div>
                </form>
                }
            </Modal>
            }

        </>
    )
}