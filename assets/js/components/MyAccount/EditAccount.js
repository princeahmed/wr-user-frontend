const {TextControl, FormFileUpload} = wp.components;

const {useState} = wp.element;

export default function EditAccount() {
    const avatar = '';
    const [changePass, setChangePass] = useState(false);

    return (
        <>
            <h3 className="section-title">Account Details</h3>

            <form className="wp-radio-form wp-radio-form-edit-account" method="post" encType="multipart/form-data">

                <p className="wp-radio-form-row wp-radio-form-row--wide avatar-field">
                    <label htmlFor="avatar">Avatar Image:</label>

                    <FormFileUpload
                        accept="image/*"
                        onChange={(e) => console.log('new image', e)}
                        render={({openFileDialog}) => (
                            <button type="button" onClick={openFileDialog}>Upload image</button>
                        )}
                    />

                    <img src={avatar} alt="user-avatar"/>
                </p>


                <div className="wp-radio-flex">
                    <div className="wp-radio-col-6">
                        <p className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="First Name:"
                                placeholder="First Name"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                help="Enter your first name"
                            />
                        </p>
                    </div>
                    <div className="wp-radio-col-6">
                        <p className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Last Name:"
                                placeholder="Last Name"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                help="Enter your last name"
                            />
                        </p>
                    </div>
                </div>

                <p className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextControl
                        label="Email Address:"
                        placeholder="Email Address"
                        value={"myemail@emails.com"}
                        onChange={e => console.log(e)}
                        type="email"
                        help="Enter your email address"
                    />
                </p>

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
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                type="password"
                                help="Enter your current password"
                            />
                        </p>

                        <p className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="New password (leave blank to leave unchanged)"
                                placeholder="New password"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                type="password"
                                help="Enter your new password"
                            />
                        </p>

                        <p className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Confirm new password"
                                placeholder="Confirm new password"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                type="password"
                                help="Enter the new password again to confirm"
                            />
                        </p>
                    </div>
                    }

                </div>

            </form>
        </>
    )
}