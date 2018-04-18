Ext.define('Sgis.store.JibunSearchStore', {
	
	extend: 'Ext.data.Store',

	fields: ['id', 'addr', 'layerNum'],

	autoLoad: false,

	remoteSort: true,

	listeners: {
		beforeload: function(store) {
			Ext.defer(function() {
				
				var JibunList = null;
				JibunList = Ext.getCmp("cmbArea4").getStore().data.items;
				
				var layerNum = null;
				for(var i = 0 ; i < _LCLlegend.length ; i++){
					if(_LCLlegend[i].layerName.substr(16,2) == Ext.getCmp("cmbArea1").getValue().substr(0,2)){
						layerNum = _LCLlegend[i].layerId;
					}					
				}
				
				if(layerNum == null){
					return;
				}
				
				var queryTask = new esri.tasks.QueryTask(_API.lsmdContLdreg +"/"+layerNum);
				
				var query = new esri.tasks.Query();
				
				query.where = " PNU LIKE '" + store.admCd +"%'";
				query.where += " AND SAN = '" + store.sanCd + "'";
				if(store.inbu){
					query.where += "	AND BON = '" + store.bonCd +"'";
					query.where += "	AND BU like '" + store.buCd +"%'";
				}else{
					query.where += "	AND BON = '" + store.bonCd +"'";
				}
				

				query.returnGeometry = false;
				query.outFields = ["*"];
				
				
				var receiveData = [];
				queryTask.execute(query,  function(results){
					var data = results.features;
					
					if(data.length < 1){
						alert("해당지번검색결과가 없습니다.");
						Ext.getCmp("btnSResult").setHidden(true);
						Ext.getCmp("btnSRBox").setHidden(true);
						return;
					}else{
						Ext.each(data, function(media, index) {
							var addr = "";
							Ext.each(JibunList, function(a, b) {
								//console.info(a.data.id.toString().substr(0,10));
								if(a.data.id.toString().substr(0,10) == media.attributes.PNU.substr(0,10)){
									//addr = a.data.doNm + " " + a.data.ctyNm + " " + a.data.dongNm + " " + a.data.name ;
									//주소 길이 문제로 시도 빠짐
									addr = a.data.ctyNm + " " + a.data.dongNm + " " + a.data.name ;
								}
							});
							var sanAddr = media.attributes.PNU.substr(10,1) == "2" ? "산" : "";
							
							var bonAddr = media.attributes.PNU.substr(11,4).replace(/(^0+)/, "");
							
							var buAddr = media.attributes.PNU.substr(15,4).replace(/(^0+)/, "");
							
							var addrSub = "";
							if(buAddr == ""){
								addrSub = bonAddr + "번지";
							}else{
								addrSub = bonAddr +"-"+ buAddr + "번지";
							}
							
							receiveData.push({
								id:media.attributes.PNU , addr:addr + " " + sanAddr + " " + addrSub, layerNum: layerNum
							});
							
							
						});
						
						store.setData(receiveData);
						
						Ext.getCmp("btnSResult").setHidden(false);
						Ext.getCmp("btnSRBox").setHidden(false);
						
					}
					
				});
				
				dojo.connect(queryTask, "onError", function(err) {
					alert(err);
				});
			}, 1, this);
        }
    }
});
