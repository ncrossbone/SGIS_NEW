/**
* South Controller
*/
Ext.define('Sgis.view.south.SouthController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-south',

	constructor: function() {
		this.callParent();
		Sgis.getApplication().addListener('searchComplete', this.searchGrid, this);
		Sgis.getApplication().addListener('leftTabChange', this.leftTabChangeHandler, this);
	},
	
	searchGrid: function(results) {
		if(!results || results.length == 0) {
			return;
		}
		
		for(var i = 0 ; i < results.length ; i++) {
			var result = results[i];
			var grid = SGIS.showSearchGrid(result.layerId, result.title);
			if(grid) {
				grid.refreshGrid(result);
			}
		}
	},
	
	leftTabChangeHandler:function(tabXtype){
		var me = this;
		if(tabXtype=='app-west-tab2'){
			me.getView().show();
    	}else{
    		me.getView().hide();
    	}
	}
});