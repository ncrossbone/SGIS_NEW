/**
* This class is the main view for the application. It is specified in app.js as the
* "autoCreateViewport" property. That setting automatically applies the "viewport"
* plugin to promote that instance of this class to the body element.
*/
Ext.define('Sgis.view.main.Main', {
	
	extend: 'Ext.container.Container',
	
	plugins: 'viewport',
	
	requires: [
		'Sgis.view.main.MainController',
		'Sgis.view.main.MainModel'
	],

	xtype: 'app-main',

	controller: 'main',
	
	viewModel: {
		type: 'main'
	},

	layout: {
		type: 'border'
	},

	items: [{
		region: 'center',
		xtype: 'app-center'
	}]
	
});
