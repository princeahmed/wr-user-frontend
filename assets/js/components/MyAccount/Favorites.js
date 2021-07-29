import Loop from '../../../../../wp-radio/assets/js/Listing/Loop'

export default function Favorites() {
    const favorites = [
        {id: 137, title: 'ABC Radio', slogan: 'slogan', link: '#', thumbnail: '', content: 'Yo'}
    ]

    return (
        <>
            <h3 className="section-title">Favorite Stations</h3>

            <div className="wp-radio-listings">
                <Loop items={favorites}/>
            </div>
        </>
    )
}