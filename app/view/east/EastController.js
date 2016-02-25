/**
 * East Controller
 */
Ext.define('Sgis.view.east.EastController', {
	
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-east',

	constructor: function() {
		this.callParent();
		Sgis.getApplication().addListener('spotChanged', this.spotPropertyChange, this);
	},
	
	spotPropertyChange: function(properties) {
		var propertyGrid = this.getView().down('spot_property_grid');
		propertyGrid.getStore().setFields(['id', 'name', 'value']);
		propertyGrid.getStore().loadRawData(properties);
		this.getView().expand();
	}
});
