import icons from './icons.json'
import classNames from "classnames";
import {getFavorites} from "./functions";

const {useState, useEffect} = wp.element;

export default function FavoriteBtn({id}) {

    const [favorites, setFavorites] = useState(getFavorites());
    const [active, setActive] = useState(favorites.includes(id));

    useEffect(() => {
        setActive(favorites.includes(id));
    }, [id]);

    const handleFavorite = () => {

        if (WRUF.currentUserID == 0) {
            alert("Please, login to add the station to your favorite list.")
            return;
        }

        setActive(!active);

        wp.apiFetch({
            path: `wp-radio/v1/favorites?post_id=${id}&action=${active ? 'remove' : 'add'}`
        }).then(({data}) => {
            setFavorites(data);
            localStorage.setItem('favorite_stations', JSON.stringify(data));
        });
    }


    return (
        <button
            type="button"
            className={classNames('favorite-btn', {active: active})}
            dangerouslySetInnerHTML={{__html: icons.heart}}
            onClick={handleFavorite}
        >

        </button>
    )
}