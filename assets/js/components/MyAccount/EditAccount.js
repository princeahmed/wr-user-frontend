const {TextControl} = wp.components;

const {useState} = wp.element;

export default function EditAccount({user}) {


    const [changePass, setChangePass] = useState(false);
    const [formData, setFormData] = useState(user);

    function handleSubmit(e) {
        e.preventDefault();

        wp.apiFetch({
            method: 'POST',
            path: `wp-radio/v1/update-account`,
            data: formData
        }).then((res) => console.log(res));

    }

    return (
        <>
            <h3 className="section-title">Account Details</h3>

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
                                onChange={lastName => setFormData(...formData, lastName)}
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
                        onChange={email => setFormData(...formData, email)}
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

                <p className="wp-radio-form-row wp-radio-form-row--wide">
                    <button type="submit" className="wp-radio-btn">
                        Update
                    </button>
                </p>

            </form>
        </>
    )
}