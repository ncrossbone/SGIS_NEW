Ext.define('Sgis.view.west.LayerInfoPopupGrid', {

	extend: 'Cmm.view.Popup',

	xtype: 'west_layer_info_grid',

	title: '레이어 출처',
	
	height: 615,
	
	width: 750,
	
	items: [{
		xtype : 'grid',

		store : Ext.create('Sgis.store.LayerInfoStore'),

		flex : 1,
		
		autoScroll : true,
		
		rowLines : true,
		
		columnLines : true,

		columns : [ { 
			dataIndex : 'id',
			text : 'ID',
			hidden : true
		}, {
			dataIndex : 'category',
			text : '',
			width : 130
		}, {
			dataIndex : 'name',
			text : '레이어명',
			flex : 1
		}, {
			dataIndex : 'source',
			text : '자료출처',
			flex : 1
		}, {
			dataIndex : 'created_year',
			text : '생성년도',
			width : 80
		}, {
			dataIndex : 'update_cycle',
			text : '갱신주기',
			width : 80
		} ]
	}]
});
