import Select from "react-select";
import {countryFlag} from "../../../../wp-radio/assets/js/components/functions";

const {TextControl, TextareaControl, FormFileUpload} = wp.components

const {useState} = wp.element;

export default function SubmitStation({countries, genres}) {

    const [formData, setFormData] = useState({});

    function onSubmit(e) {
        e.preventDefault();

        wp.apiFetch({
            method: 'POST',
            path: `wp-radio/v1/submit-station`,
            data: formData
        });
    }


    const countryOptions = [{label: <span>{countryFlag('ww')} All Countries</span>, value: 'all'}];
    Object.keys(countries).map(key => (countryOptions.push({
        value: key,
        label: <span> {countryFlag(key)} {countries[key]} </span>
    })));

    const genreOptions = [{label: 'All Genres', value: 'all'}];
    Object.keys(genres).map(key => (genreOptions.push({value: key, label: genres[key]})));

    const {
        title,
        slogan,
        streamURL,
        content,
        country,
        genre,
        website,
        facebook,
        twitter,
        wikipedia,
        address,
        email,
        phone
    } = formData;

    return (
        <div className="wp-radio-col-12">
            <form className="wp-radio-form wp-radio-form-submit-station" onSubmit={onSubmit}>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextControl
                        label="Station Title:"
                        placeholder="Station title"
                        value={title}
                        onChange={title => setFormData({...formData, title})}
                        type="text"
                        help="Enter the radio station name"
                    />
                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextControl
                        label="Station Slogan:"
                        placeholder="Station slogan"
                        value={slogan}
                        onChange={slogan => setFormData({...formData, slogan})}
                        type="text"
                        help="Enter the radio station slogan"
                    />
                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextControl
                        label="Stream URL:"
                        placeholder="Stream Link"
                        value={streamURL}
                        onChange={streamURL => setFormData({...formData, streamURL})}
                        type="url"
                        help="Enter the radio station live streaming URL"
                    />
                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <TextareaControl
                        label="Station Description:"
                        placeholder="Station description"
                        value={content}
                        onChange={content => setFormData({...formData, content})}
                        help="Enter the radio station short description"
                    />
                </div>

                <div className="wp-radio-form-row wp-radio-form-row--wide">
                    <label>Station Logo</label>

                    <FormFileUpload
                        accept="image/*"
                        onChange={(e) => {

                            console.log({...e})

                            wp.apiFetch({
                                method: 'POST',
                                path: `wp-radio/v1/submit-station`,
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                data: e.target.files
                            });
                        }}
                        render={({openFileDialog}) => (
                            <div>
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
                                value={country}
                                isClearable
                                onChange={country => setFormData({...formData, country})}

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
                                value={genre}
                                isMulti
                                isClearable
                                onChange={genre => {
                                    setFormData({...formData, genre});
                                }}

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
                                value={website}
                                onChange={website => setFormData({...formData, website})}
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
                                value={facebook}
                                onChange={facebook => setFormData({...formData, facebook})}
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
                                value={twitter}
                                onChange={twitter => setFormData({...formData, twitter})}
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
                        value={address}
                        onChange={address => setFormData({...formData, address})}
                        help="Enter the radio station address"
                    />
                </div>

                <div className="wp-radio-flex">

                    <div className="wp-radio-col-6">
                        <div className="wp-radio-form-row wp-radio-form-row--wide">
                            <TextControl
                                label="Email:"
                                placeholder="Contact Email"
                                value={email}
                                onChange={email => setFormData({...formData, email})}
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
                                value={phone}
                                onChange={phone => setFormData({...formData, phone})}
                                type="text"
                                help="Enter the radio station contact phone number."
                            />
                        </div>
                    </div>

                </div>

                <p className="wp-radio-form-row">
                    <button type="submit" className="wp-radio-button button">Submit</button>
                </p>

            </form>
        </div>
    )
}

const element = document.getElementById('submit-station');

if (element) {
    let countries = element.getAttribute('data-countries');
    let genres = element.getAttribute('data-genres');

    countries = countries ? JSON.parse(countries) : {};
    genres = genres ? JSON.parse(genres) : {};

    wp.element.render(<SubmitStation countries={countries} genres={genres}/>, element);
}