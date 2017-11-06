Ext.define('Sgis.store.Jibun4Store', {
	
	extend: 'Ext.data.Store',

	fields: ['id', 'name' , 'doNm' , 'ctyNm' , 'dongNm', 'riNm'],

	autoLoad: true,
	
	remoteSort: true,

	listeners: {
		beforeload: function(store) {
			Ext.defer(function() {
				var queryTask = new esri.tasks.QueryTask(_API.layer1_new+"/"+_API.layer1Re);
				var query = new esri.tasks.Query();
				query.returnGeometry = false;
				query.where = '1=1';
				query.outFields = ['ADM_CD', 'RI_NM' , 'DO_NM' , 'CTY_NM' , 'DONG_NM'];
				queryTask.execute(query,  function(results){
					var data = results.features;
					data.sort(function(a,b){
						if(a.attributes.RI_NM > b.attributes.RI_NM){
							return 1;
						}else if(a.attributes.RI_NM < b.attributes.RI_NM){
							return -1;
						}else{
							return 0;
						}
					});
					var receiveData = [{id:'_cancel_', name:'--선택해제--'}];
					Ext.each(data, function(media, index) {
						receiveData.push({id:media.attributes.ADM_CD, name:media.attributes.RI_NM,
							doNm : media.attributes.DO_NM , ctyNm : media.attributes.CTY_NM ,
							dongNm : media.attributes.DONG_NM , riNm : media.attributes.RI_NM})
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
