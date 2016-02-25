Ext.define('Sgis.view.west.WestTab1', {
	
	extend: 'Ext.container.Container',
	
	requires: [
		'Sgis.view.west.WestTab1Controller'
	],
	
	xtype: 'app-west-tab1',

	title: '레이어',

	bodyPadding: 10,
	
	autoScroll: true,
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	items: [{
		xtype: 'panel',
		layout: {
			type: 'accordion',
			animate: true,
			multi: true
		},
		
		items:[{
			title: '레이어',
			xtype: 'treepanel',
			id:'layerTree1',
			controller: 'app-west-tab1',
			rootVisible: false,
			useArrows: true,
			bufferedRenderer: false,
			store : Ext.create('Sgis.store.LayerTreeStore')
		},{
			title: '주제도',
			xtype: 'treepanel',
			collapsed: false,
			id:'layerTree3',
			controller: 'app-west-tab1',
			rootVisible: false,
			useArrows: true,
			bufferedRenderer: false,
			hidden:false,
			store : Ext.create('Sgis.store.Layer3TreeStore')
		}]
	}]
});