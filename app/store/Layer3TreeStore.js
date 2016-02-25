Ext.define('Sgis.store.Layer3TreeStore', {
	
	extend: 'Ext.data.TreeStore',

	autoLoad: true,

	proxy: {
		type: 'ajax',
		url: './resources/data/west/layer3-tree-data.json',
		reader: {
			type: 'json'
		}
	}
});
