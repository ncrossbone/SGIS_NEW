Ext.define('Sgis.view.south.popup.InfoResultController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sourth_branch_infoResult',
    
    afterrenderHandler:function(){
    	var params = this.getView().params;
    	this.getView().addItem(); 
    	this.getView().getViewModel().arcSearch(params);
    }
});