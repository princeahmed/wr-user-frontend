export default function Dashboard({setTab, user, logoutURL}) {
    return (
        <>
            <p>Hello <strong>{user.userName}</strong> (not <strong>{user.userName}</strong>? <a href={logoutURL}>Log out</a>)</p>

            <p>From your account dashboard you can view your recent
                <a href="#" onClick={() => setTab('favorites')}> favourite stations</a>,
                and <a href="#" onClick={() => setTab('edit-account')}> edit your password and account details</a>.
            </p>
        </>
    )
}