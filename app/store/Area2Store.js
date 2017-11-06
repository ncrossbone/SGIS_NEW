Ext.define('Sgis.store.Area2Store', {
	
	extend: 'Ext.data.Store',

	fields: ['id', 'name'],

	autoLoad: true,

	remoteSort: true,
	
	listeners: {
		beforeload: function(store) {
			Ext.defer(function() {
				//var queryTask = new esri.tasks.QueryTask(_API.layer2_new +"/"+_API.admSggLayerId); //시군구
				var queryTask = new esri.tasks.QueryTask(_API.layer1_new+"/"+_API.layer1Sgg);
				var query = new esri.tasks.Query();
				query.returnGeometry = false;
				query.where = "1=1";
				query.outFields = ["*"];
				queryTask.execute(query,  function(results){
					var data = results.features;
					data.sort(function(a,b){
						if(a.attributes.CTY_NM > b.attributes.CTY_NM){
							return 1;
						}else if(a.attributes.CTY_NM < b.attributes.CTY_NM){
							return -1;
						}else{
							return 0;
						}
					});
					var receiveData = [{id:'_cancel_', name:'--선택해제--'}];
					Ext.each(data, function(media, index) {
						receiveData.push({id:media.attributes.ADM_CD, name:media.attributes.CTY_NM})
		   				if(data.length==index+1){
		   					store.setData(receiveData);
		   				}
					});
				});
				dojo.connect(queryTask, "onError", function(err) {
					alert(err);
				});
			}, 1, this);
        }
    }
});
