Ext.define('Sgis.view.south.popup.BranchInfoPopupController', {
	
	extend: 'Ext.app.ViewController',
	
	alias: 'controller.sourth_branch_info',
	
	control: {
		'sourth_branch_info' : {
			paramschange: 'paramschangeHandler'
		}
	},
	
	paramschangeHandler:function(e){
		this.getView().makeChild();
	}
});
