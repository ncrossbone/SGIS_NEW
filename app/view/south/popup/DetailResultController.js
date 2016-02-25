Ext.define('Sgis.view.south.popup.DetailResultController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sourth_detail_infoResult',
    
    afterrenderHandler:function(){
    	var params = this.getView().params;
    	this.getView().addItem(); 
    	this.getView().getViewModel().arcSearch(params);
    }
});