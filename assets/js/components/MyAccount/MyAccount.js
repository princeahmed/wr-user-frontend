import classNames from "classnames";
import Dashboard from "./Dashboard";
import Favorites from "./Favorites";
import EditAccount from "./EditAccount";

const {useState} = wp.element;

export default function MyAccount({favorites, user, logoutURL}) {

    const [tab, setTab] = useState('dashboard')

    const handleMenu = (e, tab) => {
        e.preventDefault();

        setTab(tab);
    }

    return (
        <div className="wp-radio-my-account wp-radio-flex">
            <nav className="wp-radio-my-account-navigation wp-radio-col-3">
                <ul>

                    <li className={classNames({active: 'dashboard' === tab})}>
                        <a href="#" onClick={(e) => handleMenu(e, 'dashboard')}>
                            <i className="dashicons dashicons-dashboard"></i> Dashboard
                        </a>
                    </li>

                    <li className={classNames({active: 'favorites' === tab})}>
                        <a href="#" onClick={(e) => handleMenu(e, 'favorites')}>
                            <i className="dashicons dashicons-heart"></i> Favorites
                        </a>
                    </li>

                    <li className={classNames({active: 'edit-account' === tab})}>
                        <a href="#" onClick={(e) => handleMenu(e, 'edit-account')}>
                            <i className="dashicons dashicons-admin-users"></i> Edit Account
                        </a>
                    </li>


                    <li className="logout">
                        <a href={logoutURL}>
                            <i className="dashicons dashicons-migrate"></i>Logout
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="wp-radio-my-account-content wp-radio-col-9">
                <div className="wp-radio-notices"></div>

                {'dashboard' === tab && <Dashboard setTab={setTab}/>}
                {'favorites' === tab && <Favorites favorites={favorites}/>}
                {'edit-account' === tab && <EditAccount user={user}/>}

            </div>

        </div>
    )
}

const element = document.getElementById('wp-radio-account');

if (element) {
    let favorites = element.getAttribute('data-favorites');
    favorites = favorites ? JSON.parse(favorites) : [];

    let user = element.getAttribute('data-user');
    user = user ? JSON.parse(user) : [];

    const logoutURL = element.getAttribute('data-logoutURL');

    wp.element.render(<MyAccount user={user} favorites={favorites} logoutURL={logoutURL} />, element);
}