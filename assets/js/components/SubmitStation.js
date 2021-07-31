import Select from "react-select";
import {countryFlag} from "../../../../wp-radio/assets/js/components/functions";

const {TextControl, TextareaControl, Spinner, Notice} = wp.components

const {useState, useRef} = wp.element;

export default function SubmitStation({countries, genres}) {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const formRef = useRef();

    function onSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const requires = {
            title: `<strong>Title</strong>`,
            content: `<strong>Description</strong>`,
            country: `<strong>Country</strong>`,
            streamURL: `<strong>Stream URL</strong>`,
            email: `<strong>Email</strong>`,
        }

        const checkErrors = [];
        Object.keys(requires).map(key => {

            if (!data[key] || data[key] === '') {
                checkErrors.push(`${requires[key]} is a required field.`);
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

        let formData = new FormData(formRef.current);

        data.genre && formData.append('genre', data.genre.map(item => item.value));

        wp.apiFetch({
            method: 'POST',
            path: 'wp-radio/v1/submit-station',
            body: formData,
            headers: {
                'X-WP-Nonce': wpRadio.nonce
            }
        }).then(({success, data}) => {
            setLoading(false);

            console.log({success, data})

            if (!success) {
                setErrors(data);

                formRef.current.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            setErrors(null);
            setSubmitted(true);


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
    } = data;

    return (
        <div className="wp-radio-col-12">
            {submitted ?

                <Notice
                    status="success"
                    isDismissible={false}
                    actions={[
                        {
                            label: 'Submit more station',
                            onClick: () => {
                                setData({});
                                setErrors(null);
                                setSubmitted(false);
                            }
                        }
                    ]}
                >
                    <p>Your station submission has been submitted. Now it is waiting for admin confirmation.</p>
                </Notice>

                :
                <form ref={formRef} className="wp-radio-form wp-radio-form-submit-station" onSubmit={onSubmit}
                      encType="multipart/form-data">

                    {!!errors &&
                    <div className="wp-radio-notice-list">
                        {
                            errors.map((content, index) => (
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

                    <div className="wp-radio-form-row wp-radio-form-row--wide">
                        <TextControl
                            label={<span className="wp-radio-required">Station Title: </span>}
                            name="title"
                            placeholder="Station title"
                            value={title}
                            onChange={title => setData({...data, title})}
                            type="text"
                            help="Enter the radio station name"
                        />
                    </div>

                    <div className="wp-radio-form-row wp-radio-form-row--wide">
                        <TextControl
                            name="slogan"
                            label="Station Slogan:"
                            placeholder="Station slogan"
                            value={slogan}
                            onChange={slogan => setData({...data, slogan})}
                            type="text"
                            help="Enter the radio station slogan"
                        />
                    </div>

                    <div className="wp-radio-form-row wp-radio-form-row--wide">
                        <TextControl
                            name="stream_url"
                            label={<span className="wp-radio-required">Stream URL:</span>}
                            placeholder="Stream Link"
                            value={streamURL}
                            onChange={streamURL => setData({...data, streamURL})}
                            type="url"
                            help="Enter the radio station live streaming URL"
                        />
                    </div>

                    <div className="wp-radio-form-row wp-radio-form-row--wide">
                        <TextareaControl
                            name="content"
                            label={<span className="wp-radio-required">Station Description:</span>}
                            placeholder="Station description"
                            value={content}
                            onChange={content => setData({...data, content})}
                            help="Enter the radio station short description"
                        />
                    </div>

                    <div className="wp-radio-form-row wp-radio-form-row--wide">
                        <label>Station Logo</label>

                        <input type="file" name="logo" onChange={(e) => setData({...data, logo: e.target.files[0]})}
                        />

                        <p className="description">Upload the station logo image</p>
                    </div>

                    <div className="wp-radio-flex">

                        <div className="wp-radio-col-6">
                            <div className="wp-radio-form-row wp-radio-form-row--wide">
                                <label className="wp-radio-required">Station country: </label>
                                <Select
                                    name="country"
                                    options={countryOptions}
                                    placeholder="Select country"
                                    value={country}
                                    isClearable
                                    onChange={country => setData({...data, country})}

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
                                <label htmlFor="">Station Genres :</label>
                                <Select
                                    options={genreOptions}
                                    placeholder="Select genres"
                                    value={genre}
                                    isMulti
                                    isClearable
                                    onChange={genre => {
                                        setData({...data, genre});
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
                                    name="website"
                                    label="Website :"
                                    placeholder="Website url"
                                    value={website}
                                    onChange={website => setData({...data, website})}
                                    type="url"
                                    help="Enter the station website URL"
                                />
                            </div>
                        </div>

                        <div className="wp-radio-col-4">
                            <div className="wp-radio-form-row wp-radio-form-row--wide">
                                <TextControl
                                    name="facebook"
                                    label="Facebook:"
                                    placeholder="Facebook url"
                                    value={facebook}
                                    onChange={facebook => setData({...data, facebook})}
                                    type="url"
                                    help="Enter the station facebook URL"
                                />
                            </div>
                        </div>

                        <div className="wp-radio-col-4">
                            <div className="wp-radio-form-row wp-radio-form-row--wide">
                                <TextControl
                                    name="twitter"
                                    label="Twitter:"
                                    placeholder="Twitter url"
                                    value={twitter}
                                    onChange={twitter => setData({...data, twitter})}
                                    type="url"
                                    help="Enter the station twitter URL"
                                />
                            </div>
                        </div>


                    </div>

                    <div className="wp-radio-form-row wp-radio-form-row--wide">
                        <TextareaControl
                            name="address"
                            label="Address:"
                            placeholder="Station address"
                            value={address}
                            onChange={address => setData({...data, address})}
                            help="Enter the radio station address"
                        />
                    </div>

                    <div className="wp-radio-flex">

                        <div className="wp-radio-col-6">
                            <div className="wp-radio-form-row wp-radio-form-row--wide">
                                <TextControl
                                    name="email"
                                    label={<span className="wp-radio-required">Email:</span>}
                                    placeholder="Contact Email"
                                    value={email}
                                    onChange={email => setData({...data, email})}
                                    type="email"
                                    help="Enter the radio station contact email."
                                />
                            </div>
                        </div>

                        <div className="wp-radio-col-6">
                            <div className="wp-radio-form-row wp-radio-form-row--wide">
                                <TextControl
                                    name="phone"
                                    label="Phone:"
                                    placeholder="Contact Phone"
                                    value={phone}
                                    onChange={phone => setData({...data, phone})}
                                    type="text"
                                    help="Enter the radio station contact phone number."
                                />
                            </div>
                        </div>

                    </div>
                    
                    <p className="wp-radio-form-row">
                    <p className="wp-radio-form-row">
                        <button type="submit" className="wp-radio-button button">
                            Submit
                            {loading && <Spinner/>}
                        </button>
                    </p>

                </form>

            }
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