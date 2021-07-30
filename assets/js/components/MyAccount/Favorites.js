import Loop from '../../../../../wp-radio/assets/js/Listing/Loop'

export default function Favorites({favorites}) {

    return (
        <>
            <h3 className="section-title">Favorite Stations</h3>

            <div className="wp-radio-listings">
                {!!favorites && !!favorites.length ? <Loop items={favorites}/>
                    : <p>You didn't add any station to your favorites list.</p>
                }
            </div>
        </>
    )
}