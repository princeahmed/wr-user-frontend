export default function Dashboard({setActive}) {
    const userName = 'Prince';
    const logoutURL = '';

    return (
        <>
            <p>Hello <strong>{userName}</strong> (not <strong>{userName}</strong>?<a href={logoutURL}>Log out</a>)</p>

            <p>From your account dashboard you can view your recent
                <a href="#" onClick={() => setActive('favorites')}>favourite stations</a>,
                and <a href="#" onClick={() => setActive('edit-account')}>edit your password and account details</a>.
            </p>
        </>
    )
}