Ext.define('Sgis.view.south.South', {
	
	extend: 'Ext.tab.Panel',
	
	requires: [
		'Sgis.view.south.LayerDynamicGrid',
		'Sgis.view.south.SouthController'
	],
	
	xtype: 'app-south',
	
	controller: 'app-south',
	
	layout: 'card',
	
	id: 'south',
	
	height: 350,
	
	plain: true,
	
	//split: true,
	
	collapsible: true,
	
	collapsed: true,
	
	//resizable: true,
	
	frame: true,
	
	title: '검색결과'
});