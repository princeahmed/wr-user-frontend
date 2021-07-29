import Select from "react-select";
const {TextControl, TextareaControl, FormFileUpload} = wp.components

export default function SubmitStation() {

    const countryOptions = [{
        bd: 'Bangladesh',
    }]
    const genreOptions = [{
        12: 'Rock',
    }]

    return (
        <div className="wp-radio-col-12">
            <form className="wp-radio-form wp-radio-form-submit-station" encType="multipart/form-data">

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextControl
                        label="Station Title:"
                        placeholder="Station title"
                        value={"myemail@emails.com"}
                        onChange={e => console.log(e)}
                        type="text"
                        help="Enter the radio station name"
                    />
                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextControl
                        label="Station Slogan:"
                        placeholder="Station slogan"
                        value={"myemail@emails.com"}
                        onChange={e => console.log(e)}
                        type="text"
                        help="Enter the radio station slogan"
                    />
                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextControl
                        label="Stream URL:"
                        placeholder="Station slogan"
                        value={"myemail@emails.com"}
                        onChange={e => console.log(e)}
                        type="url"
                        help="Enter the radio station live streaming URL"
                    />
                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextareaControl
                        label="Station Description:"
                        placeholder="Station description"
                        value={"myemail@emails.com"}
                        onChange={e => console.log(e)}
                        help="Enter the radio station short description"
                    />
                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <label htmlFor="">Station Logo</label>

                    <FormFileUpload
                        accept="image/*"
                        onChange={(e) => console.log('new image', e)}
                        render={({openFileDialog}) => (
                            <div>
                                <p>Upload an image below: </p>
                                <button type="button" onClick={openFileDialog}>
                                    Upload image
                                </button>
                            </div>
                        )}
                    />

                    <p className="description">Upload the station logo image</p>
                </div>

                <div className="wp-radio-flex">
                    <div className="wp-radio-col-6">
                        <div className="wp-radio-form-row wp-radio-form-row--wide">
                            <label htmlFor="">Station country</label>
                            <Select
                                options={countryOptions}
                                placeholder="Select country"
                                value={''}
                                isClearable
                                onChange={selected => console.log('')}

                                styles={{
                                    control: styles => ({...styles, width: '100%'}),
                                    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                                        return {
                                            ...styles,
                                        }
                                    },
                                    input: styles => ({...styles}),
                                    placeholder: styles => ({...styles}),
                                    singleValue: (styles, {data}) => ({...styles}),
                                }}
                            />
                            <p className="description">Select the radio station country</p>
                        </div>
                    </div>

                    <div className="wp-radio-col-6">
                        <div className="wp-radio-form-row wp-radio-form-row--wide">
                            <label htmlFor="">Station Genres</label>
                            <Select
                                options={genreOptions}
                                placeholder="Select genres"
                                value={''}
                                isClearable
                                onChange={selected => console.log('')}

                                styles={{
                                    control: styles => ({...styles, width: '100%'}),
                                    option: (styles, {data, isDisabled, isFocused, isSelected}) => {
                                        return {
                                            ...styles,
                                        }
                                    },
                                    input: styles => ({...styles}),
                                    placeholder: styles => ({...styles}),
                                    singleValue: (styles, {data}) => ({...styles}),
                                }}
                            />
                            <p className="description">Select the radio station genres</p>
                        </div>
                    </div>
                </div>

                <div className="wp-radio-flex">
                    <div className="wp-radio-col-4">
                        <div className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Website :"
                                placeholder="Website url"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                type="url"
                                help="Enter the station website URL"
                            />
                        </div>
                    </div>

                    <div className="wp-radio-col-4">
                        <div className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Facebook:"
                                placeholder="Facebook url"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                type="url"
                                help="Enter the station facebook URL"
                            />
                        </div>
                    </div>

                    <div className="wp-radio-col-4">
                        <div className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Twitter:"
                                placeholder="Twitter url"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                type="url"
                                help="Enter the station twitter URL"
                            />
                        </div>
                    </div>


                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextareaControl
                        label="Address:"
                        placeholder="Station address"
                        value={"myemail@emails.com"}
                        onChange={e => console.log(e)}
                        help="Enter the radio station address"
                    />
                </div>

                <div className="wp-radio-flex">
                    <div className="wp-radio-col-6">
                        <div className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Email:"
                                placeholder="Contact Email"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                type="email"
                                help="Enter the radio station contact email."
                            />
                        </div>
                    </div>
                    <div className="wp-radio-col-6">
                        <div className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Phone:"
                                placeholder="Contact Phone"
                                value={"myemail@emails.com"}
                                onChange={e => console.log(e)}
                                type="text"
                                help="Enter the radio station contact phone number."
                            />
                        </div>
                    </div>

                </div>


                <p className="wp-radio-form-row">
                    <button type="button" className="wp-radio-button button">
                        Submit
                    </button>
                </p>

            </form>
        </div>
    )
}

const element = document.getElementById('submit-station');

if (element) {
    wp.element.render(<SubmitStation/>, element);
}