const {SelectControl, FormToggle, Spinner} = wp.components;

export default function Settings({data, setData, isUpdating, setIsUpdating}) {

    const pages = Object.keys(wpRadioSettingsData.pages).map(key => {
        return {
            label: wpRadioSettingsData.pages[key],
            value: key
        }
    });

    const {
        account_page = '',
        submit_station_page = '',
        enable_comment = true,
        enable_report = true,
        enable_reviews = true,
    } = data;

    return (
        <div className="wp-radio-settings-body">
            <h2 className={'wp-radio-settings-body-title'}>{wp.i18n.__('User Frontend Settings', 'wp-radio')}</h2>

            {/* My account page */}
            <div className="wp-radio-settings-field">
                <span className="wp-radio-settings-field-label">{wp.i18n.__('My account page', 'wp-radio')}</span>

                <div className="wp-radio-settings-field-content">
                    <SelectControl
                        value={account_page}
                        onChange={(account_page) => {
                            setData(data => ({...data, account_page}))
                        }}
                        options={[
                            {
                                label: wp.i18n.__('Select page', 'wp-radio'),
                                value: '',
                                disabled: true
                            },
                            ...pages]}
                    />

                    <span className="description">Select the page which contains the [wp_radio_my_account] shortcode for the users account page.</span>
                </div>
            </div>

            {/* Station submission page */}
            <div className="wp-radio-settings-field">
                <span
                    className="wp-radio-settings-field-label">{wp.i18n.__('Station submission page', 'wp-radio')}</span>

                <div className="wp-radio-settings-field-content">
                    <SelectControl
                        value={submit_station_page}
                        onChange={(submit_station_page) => setData(data => ({...data, submit_station_page}))}
                        options={[
                            {
                                label: wp.i18n.__('Select page', 'wp-radio'),
                                value: '',
                                disabled: true
                            },
                            ...pages]}
                    />

                    <span className="description">Select the page which contains the [wp_radio_submit_station] shortcode for the station submission page.</span>
                </div>
            </div>

            {/* Enable Report submissions*/}
            <div className="wp-radio-settings-field">
                <span
                    className="wp-radio-settings-field-label">{wp.i18n.__('Enable report submission', 'wp-radio')}</span>

                <div className="wp-radio-settings-field-content">
                    <FormToggle
                        checked={JSON.parse(enable_report)}
                        onChange={() => setData(data => ({...data, enable_report: !JSON.parse(enable_report)}))}
                    />

                    <span
                        className="description">{wp.i18n.__('Show/ hide the report submission button for the users to report if any station not works properly.', 'wp-radio')}</span>
                </div>
            </div>

            {/* Enable comments */}
            <div className="wp-radio-settings-field">
                <span
                    className="wp-radio-settings-field-label">{wp.i18n.__('Enable comments', 'wp-radio')}</span>

                <div className="wp-radio-settings-field-content">
                    <FormToggle
                        checked={JSON.parse(enable_comment)}
                        onChange={() => setData(data => ({...data, enable_comment: !JSON.parse(enable_comment)}))}
                    />

                    <span
                        className="description">{wp.i18n.__('Show/ hide the comments & the comments form on the station single page.', 'wp-radio')}</span>
                </div>
            </div>

            {/* Enable reviews */}
            <div className="wp-radio-settings-field">
                <span
                    className="wp-radio-settings-field-label">{wp.i18n.__('Enable reviews', 'wp-radio')}</span>

                <div className="wp-radio-settings-field-content">
                    <FormToggle
                        checked={JSON.parse(enable_reviews)}
                        onChange={() => setData(data => ({...data, enable_reviews: !JSON.parse(enable_reviews)}))}
                    />

                    <span
                        className="description">{wp.i18n.__('Show/ hide the reviews & the review submission form on the station single page.', 'wp-radio')}</span>
                </div>
            </div>

            <div className="wp-radio-settings-field">
                <button
                    type="button"
                    className="wp-radio-button"
                    onClick={() => setIsUpdating(true)}
                >
                    {isUpdating ? <Spinner/> : <i className="dashicons dashicons-saved"></i>}
                    <span>{wp.i18n.__('Save Settings', 'wp-radio')}</span>
                </button>
            </div>

        </div>
    )
}