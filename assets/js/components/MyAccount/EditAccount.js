const {TextControl, Notice, Spinner} = wp.components;

const {useState} = wp.element;

export default function EditAccount({user}) {

    const [changePass, setChangePass] = useState(false);
    const [formData, setFormData] = useState(user);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);

        const requires = {
            firstName: `<strong>First Name</strong>`,
            lastName: `<strong>Last Name</strong>`,
            email: `<strong>Email</strong>`,
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
            path: `wp-radio/v1/update-account`,
            data: formData
        }).then(({success, data}) => {
            setLoading(false);

            if (!success) {
                setErrors(data);
            }

            setSubmitted(true);

            setTimeout(() => {
                setSubmitted(false);
            }, 3000);

        });

    }


    return (
        <div className="content-edit-account">
            <h3 className="section-title">Account Details</h3>

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
                    Account details updated successfully.
                </Notice>
            </div>
            }

            <form className="wp-radio-form wp-radio-form-edit-account" onSubmit={handleSubmit}>

                <div className="wp-radio-flex">
                    <div className="wp-radio-col-6">
                        <p className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="First Name:"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={firstName => setFormData({...formData, firstName})}
                                help="Enter your first name"
                            />
                        </p>
                    </div>
                    <div className="wp-radio-col-6">
                        <p className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Last Name:"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={lastName => setFormData({...formData, lastName})}
                                help="Enter your last name"
                            />
                        </p>
                    </div>
                </div>

                <p className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextControl
                        label="Email Address:"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={email => setFormData({...formData, email})}
                        type="email"
                        help="Enter your email address"
                    />
                </p>

                <p className="wp-radio-form-row wp-radio-form-row--wide">
                    <div className="change-password">
                        <button type="button" className="button change-password-button"
                                onClick={() => setChangePass(!changePass)}>Change Password
                        </button>

                        {changePass &&
                        <div className="change-password-fields">
                            <p className="wp-radio-form-row wp-radio-form-row--wide">
                                <TextControl
                                    label="Current password (leave blank to leave unchanged)"
                                    placeholder="Current password"
                                    value={formData.currentPass}
                                    onChange={currentPass => setFormData({...formData, currentPass})}
                                    type="password"
                                    help="Enter your current password"
                                />
                            </p>

                            <p className="wp-radio-form-row wp-radio-form-row--wide">
                                <TextControl
                                    label="New password (leave blank to leave unchanged)"
                                    placeholder="New password"
                                    value={formData.newPass}
                                    onChange={newPass => setFormData({...formData, newPass})}
                                    type="password"
                                    help="Enter your new password"
                                />
                            </p>

                            <p className="wp-radio-form-row wp-radio-form-row--wide">
                                <TextControl
                                    label="Confirm new password"
                                    placeholder="Confirm new password"
                                    value={formData.confirmNewPass}
                                    onChange={confirmNewPass => setFormData({...formData, confirmNewPass})}
                                    type="password"
                                    help="Enter the new password again to confirm"
                                />
                            </p>
                        </div>
                        }

                    </div>
                </p>

                <p className="wp-radio-form-row wp-radio-submit-row wp-radio-form-row--wide">
                    <button type="submit" className="wp-radio-btn">
                        Update

                        {loading && <Spinner/>}
                    </button>
                </p>

            </form>
        </div>
    )
}