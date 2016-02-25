Ext.define('Sgis.view.center.Center', {
	
	extend: 'Ext.container.Container',
	
	requires: [
		'Sgis.view.center.Content'
	],
	
	layout: 'border',
	
	xtype: 'app-center',
	
	items: [{
		xtype: 'app-content',
		region: 'center'
	}, {
		xtype: 'app-south',
		region: 'south',
		width: 350,
		hidden: true
	}]
});