/**
* Content Controller
*/
Ext.define('Sgis.view.center.ContentController', {
	
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-content',
	
	control: {
		'app-content': {
			resize: 'resizeHandler'
		}
	},
	
	resizeHandler: function(obj, width, height, oldWidth, oldHeight, eOpts) {
		this.getView().child('app-map-coreMap').mapResize();
	}
});
