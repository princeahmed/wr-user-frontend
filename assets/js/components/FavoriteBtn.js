import icons from './icons.json'

export default function FavoriteBtn() {
    return (
        <button
            type="button"
            className="favorite-btn"
            dangerouslySetInnerHTML={{__html: icons.heart}}
        >

        </button>
    )
}