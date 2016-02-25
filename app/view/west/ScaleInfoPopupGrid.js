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
		}, {
			text : '레이어',
			columns : [{
				dataIndex : 'category',
				text : '구분',
				width : 100
			}, {
				dataIndex : 'measure_network',
				text : '측정망',
				width : 150
			}]
		}, {
			text : '라벨 ON 축척',
			columns : [{
				dataIndex : 'special_area',
				text : '특별/광역시',
				width : 150
			}, {
				dataIndex : 'etc_area',
				text : '그 외 지역',
				width : 150
			}]
		}]
	}]
});
