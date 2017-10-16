Ext.define('Sgis.store.JibunSearchStore', {
	
	extend: 'Ext.data.Store',

	fields: ['PNU', 'JIBUN'],

	autoLoad: false,

	remoteSort: true,

	listeners: {
		beforeload: function(store) {
			Ext.defer(function() {
				var JibunList = null;
				JibunList = Ext.getCmp("cmbJibun4").getStore().data.items;
				
				var layerNum = null;
				for(var i = 0 ; i < _LCLlegend.length ; i++){
					if(_LCLlegend[i].layerName.substr(16,2) == Ext.getCmp("cmbJibun1").getValue().substr(0,2)){
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
				query.where += " AND BON = '" + store.bonCd + "'";
				if(store.buCd != "0000"){
					query.where += " AND BU = '" + store.buCd + "'";
				}
				query.returnGeometry = false;
				query.outFields = ["*"];
				
				var westTab3Resultlist = Ext.getCmp("westTab3Resultlist");
				westTab3Resultlist.setHidden(false);
				westTab3Resultlist.doLayout();
				westTab3Resultlist.removeAll();
				
				westTab3Resultlist.add({
					xtype : 'panel',
					layout : {
						type : 'vbox'
					}
				});
				
				queryTask.execute(query,  function(results){
					
					var data = results.features;
					console.info(data);
					Ext.each(data, function(media, index) {
						//receiveData.push({id:media.attributes.PNU, name:media.attributes.JIBUN})
						
						var addr = "";
						//data.attributes.PNU
						Ext.each(JibunList, function(a, b) {
							if(a.data.id == media.attributes.PNU.substr(0,10)){
								addr = a.data.doNm + " " + a.data.ctyNm + " " + a.data.dongNm + " " + a.data.riNm ;
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
						//addr + sanAddr + addrSub
						westTab3Resultlist.items.items[0].add({
							xtype: 'label',
							cls: 'dj_result_info',
							style: 'left: 13px !important;',
							html: "<table class=\"dj_result\" border=\"0\" >										" +
								"<tr>                                 " +
								" <th rowspan=\"2\"><a href=\"#\" onclick= \"JibunMove('"+media.attributes.PNU+"','"+layerNum+"');\" >이동</a></th>                     " +
								" <td> " + addr + "</td> " +
								"</tr>                                " +
								"<tr>                                 " +
								" <td> " + sanAddr + addrSub + "</td> " +
								"</tr>                                " +
								"</table>                             " 
								
						})
						
		   				//store.setData(receiveData);
					});
				});
				dojo.connect(queryTask, "onError", function(err) {
					alert(err);
				});
			}, 1, this);
        }
    }
});
