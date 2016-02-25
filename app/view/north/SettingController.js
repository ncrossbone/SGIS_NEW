/**
* Setting Controller
*/
Ext.define('Sgis.view.north.SettingController', {
	
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-north-setting',

	onClickSave: function () {
		// TODO
	},
	
	onClickClose: function (button) {
		var content = Ext.getCmp('content');
		var layout = content.getLayout();
		layout.setActiveItem(0);
	}
});
