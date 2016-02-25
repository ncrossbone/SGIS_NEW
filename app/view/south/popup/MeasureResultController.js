Ext.define('Sgis.view.south.popup.MeasureResultController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sourth_branch_measureResult',
    
    control: {	
		'#measureGrid menuitem': {
			chartAdd: 'chartAddHandler',
			chartRemove: 'chartRemoveHandler'
		}
	},
	
    afterrenderHandler:function(){
    	var params = this.getView().params;
    	this.getView().makeGrid(); 
    	this.getView().getViewModel().arcSearch(params);
    },
    
    chartAddHandler:function(conIndex){
    	var info = this.getView().chartAddInfo;
    	var seriesArray = [];
    	for(var member in info){
    		seriesArray.push({
    			type: 'line',
		        xField: 'OBJECTID',
		        yField: info[member]['index'],
		        title:info[member]['text'],
		        marker: true
    		})	
    	}
    	this.getView().makeChartSeries(seriesArray);
    	this.getView().getViewModel().touch();
    },
    
    chartRemoveHandler:function(conIndex){
    	var info = this.getView().chartAddInfo;
    	var seriesArray = [];
    	for(var member in info){
    		seriesArray.push({
    			type: 'line',
		        xField: 'OBJECTID',
		        yField: info[member]['index'],
		        title:info[member]['text'],
		        marker: true
    		})	
    	}
    	this.getView().makeChartSeries(seriesArray);
    	this.getView().getViewModel().touch();
    }
});