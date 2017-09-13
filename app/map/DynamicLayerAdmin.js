Ext.define('Sgis.map.DynamicLayerAdmin', {
	map:null, 
	layer:null,
	layer2:null,
	constructor: function(map) {
        var me = this;
        me.map = map;
        me.layer = new esri.layers.ArcGISDynamicMapServiceLayer(Sgis.app.coreMap.layerInfo.layer1Url);
		me.layer.id = "DynamicLayer";
		me.map.addLayer(me.layer);
		me.layer.visible = true;
		dojo.connect(me.layer, "onUpdate", function(event){	
			
		});
		dojo.connect(me.layer, "onUpdateStart", function(event){	
			SGIS.loading.execute();
		});
		dojo.connect(me.layer, "onUpdateEnd", function(event){	
			SGIS.loading.finish();
		});
		
		me.layer2 = new esri.layers.ArcGISDynamicMapServiceLayer(Sgis.app.coreMap.layerInfo.layer2Url);
		me.layer2.id = "DynamicLayer2";
		me.map.addLayer(me.layer2);
		me.layer2.visible = true;
		dojo.connect(me.layer2, "onUpdate", function(event){	
			
		});
		dojo.connect(me.layer2, "onUpdateStart", function(event){	
			SGIS.loading.execute();
		});
		dojo.connect(me.layer2, "onUpdateEnd", function(event){	
			SGIS.loading.finish();
		});
		
		Sgis.getApplication().addListener('dynamicLayerOnOff', me.dynamicLayerOnOffHandler, me);
		Sgis.getApplication().addListener('dynamicLayer2OnOff', me.dynamicLayer2OnOffHandler, me);
		Sgis.getApplication().addListener('areaSelect', me.leftTabChangeHandler, me); //레이어탭 app-west-tab1 //자료검색탭활 app-west-tab2
    },
    
    dynamicLayerOnOffHandler: function(selectInfo){
    	var me = this;
    	if(selectInfo.length==0){
    		me.layer.setVisibleLayers([]);
    		return;
    	}
    	var layers = [];
    	Ext.each(selectInfo, function(selectObj, index) {
    		if(selectObj.data.layerId && !isNaN(selectObj.data.layerId)){
    			layers.push(selectObj.data.layerId);
    			//console.info(selectObj.data.layerId);
    		}
			if(index==selectInfo.length-1){
				me.layer.setVisibleLayers(layers);
			}
		});
    },
    
    dynamicLayer2OnOffHandler: function(selectInfo){
    	//console.info(selectInfo);
    	var me = this;
    	if(selectInfo.length==0){
    		me.layer2.setVisibleLayers([]);
    		return;
    	}
    	var layers2 = [];
    	Ext.each(selectInfo, function(selectObj, index) {
    		if(selectObj.data.layerId && !isNaN(selectObj.data.layerId)){
    			layers2.push(selectObj.data.layerId);
    		}
			if(index==selectInfo.length-1){
				me.layer2.setVisibleLayers(layers2);
			}
		});
    },
    
    leftTabChangeHandler: function(tabXtype){
    	var me = this;
    	if(tabXtype=='app-west-tab1'){
    		me.layer.setVisibility(true);
    		//me.layer2.setVisibility(true);
    	}else{
    		me.layer.setVisibility(false);
    		//me.layer2.setVisibility(false);
    	}
    }
});