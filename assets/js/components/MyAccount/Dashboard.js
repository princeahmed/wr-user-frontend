export default function Dashboard({setTab}) {
    const userName = 'Prince';
    const logoutURL = '';

    return (
        <>
            <p>Hello <strong>{userName}</strong> (not <strong>{userName}</strong>?<a href={logoutURL}>Log out</a>)</p>

            <p>From your account dashboard you can view your recent
                <a href="#" onClick={() => setTab('favorites')}> favourite stations</a>,
                and <a href="#" onClick={() => setTab('edit-account')}> edit your password and account details</a>.
            </p>
        </>
    )
}