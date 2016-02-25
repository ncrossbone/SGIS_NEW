Ext.define('Sgis.store.LayerDynamicStore', {
	
	extend: 'Ext.data.Store',
		
	fields: [],

	autoLoad: false,
		
	remoteFilter: false,

	remoteSort: false,
	
	pageSize: 15,

	proxy: {
		type: 'memory',
		enablePaging: true,
		reader: {
			type: 'json'
		}
	}
});
