/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Sgis.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'SID Portal',
		app_title: '토양지하수 정보시스템',
		brand_image: './resources/images/logo.png'
    }
});