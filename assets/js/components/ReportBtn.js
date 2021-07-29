import icons from './icons.json'

export default function FavoriteBtn({isMinimal}) {
    const text = isMinimal ? '' : `<span>Report a problem</span>`;

    return (
        <button
            type="button"
            className="report-btn"
            dangerouslySetInnerHTML={{__html: `${icons.report} ${text}`}}
        >
        </button>
    )
}