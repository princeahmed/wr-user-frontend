<div class="account-content content-dashboard active">
    <p>Hello <strong><?php echo $user->get( 'user_login' ); ?></strong> (not
        <strong><?php echo $user->get( 'user_login' ); ?></strong>? <a href="<?php echo wp_logout_url(get_permalink( wp_radio_get_settings( 'account_page' ) )); ?>">Log out</a>)
    </p>

    <p>From your account dashboard you can view your recent
        <a href="#" onclick="jQuery('.account-content').removeClass('active');jQuery(`.content-favorites`).addClass('active');"> favorite stations</a>, and
        <a href="#" onclick="jQuery('.account-content').removeClass('active');jQuery(`.content-edit-account`).addClass('active');"> edit your password and account details</a>.
    </p>
</div>