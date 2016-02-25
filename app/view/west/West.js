Ext.define('Sgis.view.west.West', {
	
	extend: 'Ext.tab.Panel',
	
	requires: [
		'Sgis.view.west.WestController',
		'Sgis.view.west.WestTab1',
		'Sgis.view.west.WestTab2'
	],

	xtype: 'app-west',
	
	controller: 'app-west',
	
	title: 'Measures',
	
	width: 285,

	collapsible: true,
		
	items: [{
		xtype: 'app-west-tab1'
	}, {
		xtype: 'app-west-tab2'
	}],
	
	bbar: [{
		id: 'btnWestLayer',
		xtype: 'button',
		text: '레이어출처',
		flex: 1,
		handler: 'onClickWestLayer'
	}, {
		id: 'btnWestScale',
		xtype: 'button',
		text: '축척정보',
		flex: 1,
		handler: 'onClickWestScale'
	}, {
		id: 'btnWestLegalNotice',
		xtype: 'button',
		text: '법적고지',
		flex: 1,
		handler: 'onClickLegalNotice'
	}]
});