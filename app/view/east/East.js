Ext.define('Sgis.view.east.East', {
	
	extend: 'Ext.panel.Panel',
	
	requires: ['Sgis.view.east.SpotPropertyGrid'],
	
	xtype: 'app-east',
	
	controller: 'app-east',
	
	width: 250,
	
	collapsible: true,
	
	collapsed: true,
	
	frame: true,
	
	autoScroll: true,
	
	title: 'Property',
	
	items: [{
		xtype : 'spot_property_grid'
	}]
});