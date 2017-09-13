Ext.define('Sgis.store.Jibun3Store', {
	
	extend: 'Ext.data.Store',

	fields: ['id', 'name' , 'doNm' , 'ctyNm' , 'dongNm'],

	autoLoad: true,

	remoteSort: true,

	listeners: {
		beforeload: function(store) {
			Ext.defer(function() {
				//var queryTask = new esri.tasks.QueryTask(_API.layer2_new +"/"+_API.admDongLayerId); //법정동
				var queryTask = new esri.tasks.QueryTask("http://112.217.167.123:20002/arcgis/rest/services/reach_V3/MapServer/68"); //시도
				var query = new esri.tasks.Query();
				query.returnGeometry = false;
				query.where = '1=1';
				query.outFields = ['ADM_CD', 'DONG_NM' , 'DO_NM' , 'CTY_NM'];
				queryTask.execute(query,  function(results){
					var data = results.features;
					data.sort(function(a,b){
						if(a.attributes.DONG_NM > b.attributes.DONG_NM){
							return 1;
						}else if(a.attributes.DONG_NM < b.attributes.DONG_NM){
							return -1;
						}else{
							return 0;
						}
					});
					var receiveData = [{id:'_cancel_', name:'--선택해제--'}];
					Ext.each(data, function(media, index) {
						receiveData.push({id:media.attributes.ADM_CD, name:media.attributes.DONG_NM,
							  doNm : media.attributes.DO_NM , ctyNm : media.attributes.CTY_NM , dongNm : media.attributes.DONG_NM})
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
