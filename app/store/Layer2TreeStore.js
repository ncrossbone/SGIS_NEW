Ext.define('Sgis.store.Layer2TreeStore', {
	
	extend: 'Ext.data.TreeStore',

	autoLoad: true,

	proxy: {
		type: 'ajax',
		url: './resources/data/west/layer2-tree-data.json',
		reader: {
			type: 'json'
		}
	}
});
