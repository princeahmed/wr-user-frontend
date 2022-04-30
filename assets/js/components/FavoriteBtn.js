import icons from './icons.json'
import classNames from "classnames";
import {getFavorites} from "./functions";
import Alert from "../../../../wp-radio/assets/js/includes/Alert";


const {useState, useEffect} = wp.element;

export default function FavoriteBtn({id}) {

    const [favorites, setFavorites] = useState(getFavorites());
    const [active, setActive] = useState(favorites.includes(parseInt(id)));

    useEffect(() => {
        setActive(favorites.includes(parseInt(id)));
    }, [id]);

    const handleFavorite = () => {

        if (WRUF.currentUserID == 0) {

            wpRadioHooks.doAction('showAlert', {
                content: wp.i18n.__('Please, login first to add the station to your favorite list.', 'wp-radio'),
                type: 'info',
                showCancel: false,
            });
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
        <>
            <Alert/>
            <button
                type="button"
                className={classNames('favorite-btn', {active: active})}
                dangerouslySetInnerHTML={{__html: icons.heart}}
                onClick={handleFavorite}
            ></button>
        </>
    )
}