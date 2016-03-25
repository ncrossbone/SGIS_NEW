Ext.define('Sgis.view.west.ScaleInfoPopupGrid', {

	extend: 'Cmm.view.Popup',

	xtype: 'west_scale_info_grid',

	title: '축척 정보',
	
	height: 300,
	
	width: 565,
	
	items: [{
		xtype : 'grid',

		store : Ext.create('Sgis.store.ScaleInfoStore'),

		flex : 1,
		
		autoScroll : true,
		
		rowLines : true,
		
		columnLines : true,

		columns : [ { 
			dataIndex : 'id',
			text : 'ID',
			hidden : true
		},{
			text : '구분',
			dataIndex : 'category',
			width: 100
		}, {
			text : '레이어명',
			dataIndex : 'measure_network',
			width: 243
		}, {
			text : '라벨 ON 축척',
			dataIndex : 'special_area',
			width: 220		
		}]
	}]
});
