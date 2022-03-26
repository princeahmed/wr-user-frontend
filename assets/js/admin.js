import Settings from "./components/Settings";


;(function () {
    wpRadioHooks.addFilter('settingsMenu', 'wp-radio', menu => {
        menu.userFrontend = {
            icon: 'dashicons-buddicons-buddypress-logo',
            title: wp.i18n.__('User Frontend Settings', 'wp-radio'),
        }

        return menu;
    });


    wpRadioHooks.addFilter('settingsContent', 'wp-radio', (content, tab, data, setData, isUpdating, setIsUpdating) => {
        if (tab !== 'userFrontend') return null;

        return <Settings
            data={data}
            setData={setData}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
        />

    });


})();