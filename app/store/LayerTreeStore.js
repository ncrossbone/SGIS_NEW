Ext.define('Sgis.store.LayerTreeStore', {
	
	extend: 'Ext.data.TreeStore',

	autoLoad: true,

	proxy: {
		type: 'ajax',
		url: './resources/data/west/layer-tree-data.json',
		reader: {
			type: 'json'
		}
	}
});
