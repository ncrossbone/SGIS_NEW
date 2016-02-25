Ext.define('Sgis.view.east.SpotPropertyGrid', {

	extend : 'Ext.grid.Panel',

	xtype : 'spot_property_grid',

	id : 'spot_property_grid',

	store : Ext.create('Ext.data.Store'),

	flex : 1,

	autoScroll : true,

	rowLines : true,

	columnLines : true,

	columns : [ { 
		dataIndex : 'id',
		width : 30,
		hidden : true
	}, { 
		dataIndex : 'name',
		flex : 1,
		text : '속성'
	}, { 
		dataIndex : 'value',
		flex : 1,
		text : '값'
	} ]
});
