Ext.define('Sgis.view.south.popup.DetailResultViewModel', {
    extend: 'Ext.app.ViewModel', 
    alias: 'viewmodel.sourth_detail_infoResult', 

    arcSearch:function(params){
    	var me = this;
    	var fields = Sgis.app.coreMap.getLayerDetailFiledInfo()[params.layerId];
    	var fieldsStr = "";
    	for(var i=0; i<fields.length; i++){
			if(i==0){
				fieldsStr += fields[i].fid
			}else{
				fieldsStr += "," + fields[i].fid 
			}
		}
    	
    	var queryTask = new esri.tasks.QueryTask(Sgis.app.coreMap.layerInfo.layer1Url + "/" + params.layerId);
		var query = new esri.tasks.Query();
		query.returnGeometry = false;
		query.outSpatialReference = {"wkid":102100};
		query.where = "OBJECTID=" + params.record.data.OBJECTID;
		//query.outFields = [fieldsStr];
		query.outFields = ["*"];
		queryTask.execute(query,  function(results){
			me.setData(results.features[0].attributes);
		});
		dojo.connect(queryTask, "onError", function(err) {
			SGIS.msg.alert(err);
		});
    }
});