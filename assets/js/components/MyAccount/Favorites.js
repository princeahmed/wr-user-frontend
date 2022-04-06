import Loop from '../../../../../wp-radio/assets/js/Listing/Loop'
import Pagination from "../../../../../wp-radio/assets/js/components/Pagination/Pagination";


const {Spinner} = wp.components;
const {useState, useRef} = wp.element;

export default function Favorites({initFavorites, pageCount}) {

    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState(initFavorites);
    const [paginate, setPaginate] = useState(1);

    const listingRef = useRef();

    const onPageChange = (page) => {
        setLoading(true);
        setPaginate(page);

        wp.apiFetch({
            path: `wp-radio/v1/user-favorites/?paginate=${page}`
        }).then(({success, data}) => {

            setLoading(false);
            setFavorites(data);

            listingRef.current.scrollIntoView({
                behavior: 'smooth'
            });

        });
    }

    return (
        <div className="content-favorites">
            <h3 className="section-title">Favorite Stations</h3>

            <div ref={listingRef} className="wp-radio-listings">
                {!!favorites && !!favorites.length
                    ? <Loop items={favorites}/>
                    : <p>{wp.i18n.__('You didn\'t add any station to your favorites list.', 'wp-radio')}</p>
                }
            </div>

            {pageCount > 1 &&
                <div className="listing-footer">
                    <Pagination
                        className={"wp-radio-pagination"}
                        pageCount={pageCount}
                        currentPage={paginate}
                        onPageChange={page => onPageChange(page)}
                    />

                    {loading && <Spinner/>}
                </div>
            }

        </div>
    )
}