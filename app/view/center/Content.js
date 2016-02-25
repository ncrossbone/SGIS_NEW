Ext.define('Sgis.view.center.Content', {
	
	extend: 'Ext.panel.Panel',
	
	requires: [
	   	'Sgis.view.center.ContentController',
	   	'Sgis.map.CoreMap',
		'Sgis.view.north.Setting'
	],
	
	region: 'center',
	
	id: 'content',
		
	xtype: 'app-content',
	
	layout: 'card',
	
	controller: 'app-content',
	
	items: [{
		xtype: 'app-map-coreMap',
		width: '100%',
		height: '100%'
	}, {
		xtype: 'app-north-setting'
	}]
});