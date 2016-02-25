Ext.define('Sgis.store.ScaleInfoStore', {
	
	extend: 'Ext.data.Store',

	fields: ['id', 'category', 'name', 'source', 'created_year', 'update_cycle'],

	autoLoad: true,

	remoteSort: true,

	proxy: {
		type: 'rest',
		url: './resources/data/west/scale-info.json',
		reader: {
			type: 'json'
		}
	}
});
