Ext.define('Sgis.store.Area1Store', {
	
	extend: 'Ext.data.Store',

	fields: ['id', 'name'],

	autoLoad: true,

	remoteSort: true,

	listeners: {
		beforeload: function(store) {
			Ext.defer(function() { 
				var queryTask = new esri.tasks.QueryTask("http://112.218.1.243:20002/arcgis/rest/services/Layer2_new/MapServer/15"); //시도
				var query = new esri.tasks.Query();
				query.returnGeometry = false;
				query.where = "1=1";
				query.outFields = ["*"];
				queryTask.execute(query,  function(results){
					var data = results.features;
					data.sort(function(a,b){
						if(a.attributes.DO_NM > b.attributes.DO_NM){
							return 1;
						}else if(a.attributes.DO_NM < b.attributes.DO_NM){
							return -1;
						}else{
							return 0;
						}
					});
					var receiveData = [];
					Ext.each(data, function(media, index) {
						receiveData.push({id:media.attributes.ADM_CD, name:media.attributes.DO_NM})
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
