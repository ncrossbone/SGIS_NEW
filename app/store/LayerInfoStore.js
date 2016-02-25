Ext.define('Sgis.store.LayerInfoStore', {
	
	extend: 'Ext.data.Store',

	fields: ['id', 'category', 'name', 'source', 'created_year', 'update_cycle'],

	autoLoad: true,

	remoteSort: true,

	proxy: {
		type: 'rest',
		url: './resources/data/west/layer-info.json',
		reader: {
			type: 'json'
		}
	}
});
