Ext.define('Sgis.map.SearchLayerAdmin', {
	requires: [
	           'Sgis.map.InfoWindow'
	],
	map:null, 
	toolbar:null,
	selectLayerInfo:{},
	geometry:null,
	sourceGraphicLayer:null,
	targetGraphicLayer:null,
	highlightGraphicLayer:null,
	layer1Url: null,
	area1Arr:[],
	timerId:null,
	spSearchBool:true,
	layers:[],
	smpLineSymbol:null,
	simpleFillSymbol:null,
	geometryService:null,
	buffRadus:null,
	
	layerDisplayFiledInfo:{},
	layerBranchFiledInfo:{},
	layerDetailFiledInfo:{},
	layerChartFiledInfo:{},
	
	constructor: function(map, geometryService) {
		var me = this;
		me.map = map;
		me.geometryService = geometryService;
		
		me.layer1Url = Sgis.app.coreMap.layerInfo.layer1Url;
		
		me.fullExtentMove = Sgis.app.coreMap.fullExtentMove;
		me.fullExtent = Sgis.app.coreMap.fullExtent;
		
		me.smpLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255,0.8]), 2);
		me.simpleFillSymbol= new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, me.smpLineSymbol, new dojo.Color([0,0,255,0.1]));
		
		me.sourceGraphicLayer = new esri.layers.GraphicsLayer();
		me.sourceGraphicLayer.id="sourceGraphic";
		me.map.addLayer(me.sourceGraphicLayer);
		dojo.connect(me.sourceGraphicLayer, "onClick", function(event){
        	if(event.graphic.img && event.graphic.img =='btn_close' && event.graphic.geometry.uuid){
        		me.sourceGraphicLayer.clear();
        		me.spSearch();
        	}
		});
		
		me.targetGraphicLayer = new esri.layers.GraphicsLayer();
		me.targetGraphicLayer.id="targetGraphic";
		me.map.addLayer(me.targetGraphicLayer);
		dojo.connect(me.targetGraphicLayer, "onClick", function(event){
			
			
			var attributes = event.graphic.attributes;
			var layerId = attributes._layerId_;
			
			var storeRecord = Ext.getCmp("layerTree2").store.findRecord('id', layerId);
			//url이 없을시 return;
			if(storeRecord.data.linkNum == undefined){
				return;
			}
			
			SGIS.popup('Sgis.map.InfoWindow');
			Ext.getCmp('InfoWindowField1').setValue(attributes.PT_NM);
			Ext.getCmp('InfoWindowField2').setValue(attributes.ADDR);
			Ext.getCmp('InfoWindowField3').setValue(attributes.CODE);
			Ext.getCmp('InfoWindowField4').setValue(storeRecord.data.linkNum);
			Ext.getCmp('InfoWindowIns').setTitle(attributes._layerName_);
			
			
			/*var properties = [];
			for(var mem in attributes){
				properties.push({id:mem, name:mem, value:attributes[mem]});
			}
			Sgis.getApplication().fireEvent('spotChanged', properties);*/
		});
		
		me.highlightGraphicLayer = new esri.layers.GraphicsLayer();
		me.highlightGraphicLayer.id="highlightGraphic";
		me.map.addLayer(me.highlightGraphicLayer);
		
		me.toolbar = new Sgis.map.toolbar.CustomDraw(me.map, {showTooltips:false}, true, me.sourceGraphicLayer);
		dojo.connect(me.toolbar, "onDrawEnd", function(event){
			me.map.setMapCursor("default");
			me.addToMap(event);
		});
		
		me.getLayerDisplayFiledInfo();
		me.getLayerBranchFiledInfo();
		me.getLayerDetailFiledInfo();
		me.getLayerChartFiledInfo();
		
		Sgis.getApplication().addListener('searchLayerOnOff', me.searchLayerOnOfffHandler, me);
		Sgis.getApplication().addListener('searchBtnClick', me.searchBtnClickfHandler, me);
		Sgis.getApplication().addListener('leftTabChange', me.leftTabChangeHandler, me); //레이어탭 app-west-tab1 //자료검색탭활 app-west-tab2
		Sgis.getApplication().addListener('areaSelect', me.areaSelectHandler, me); 
		Sgis.getApplication().addListener('dataGridSelect', me.dataGridSelectHandler, me); 
		Sgis.getApplication().addListener('searchParamChange', me.searchParamChangeHandler, me); 
		
		dojo.connect(me.map, "onExtentChange", 
			 function(extent){  
		 		me.areaAutoDisplayCheck();
	 		}
		 )
    },
    
    addToMap:function(event){
		var me = this;
        me.toolbar.deactivate();
        me.map.isPan = true;
        if(event.type=='extent'){
        	me.geometry = new esri.geometry.Extent(event);
        	 me.addDrawGraphic(event)
        }else if(event.type=='point'){
        	symbol = new esri.symbol.SimpleMarkerSymbol();
        	me.geometry = new esri.geometry.Point(event);
        	me.bufferDisplayAndXY();
        }else if(event.type=='polygon'){
        	me.geometry = new esri.geometry.Polygon(event);
        	 me.addDrawGraphic(event)
        }
	},
	
	addDrawGraphic:function(event){
		var me = this;
		var graphic = new esri.Graphic(me.geometry, me.simpleFillSymbol);
        me.sourceGraphicLayer.clear();
        me.sourceGraphicLayer.add(graphic);
        
        var symbol = new esri.symbol.PictureMarkerSymbol(Sgis.app.meUrl + './GIS/resources/images/btn_close.png' , 16, 16);
        var point
        if(event.type=='polygon'){
        	var finalRing = event.rings[0][event.rings[0].length-1];
    		point = new esri.geometry.Point(finalRing[0], finalRing[1], new esri.SpatialReference({"wkid":102100}));
        }else{
    		point = new esri.geometry.Point(event.xmax, event.ymax, new esri.SpatialReference({"wkid":102100}));
        }
		point.uuid = dojo.dojox.uuid.generateRandomUuid();
		var graphic = new esri.Graphic(point, symbol);
		graphic.img = 'btn_close'; 
		me.sourceGraphicLayer.add(graphic);
        
        Sgis.getApplication().fireEvent('drawComplte', null);
        me.spSearch();
	},
    
    searchBtnClickfHandler:function(btnInfo){
    	var me = this;
    	me.sourceGraphicLayer.clear();
		me.targetGraphicLayer.clear();
		me.highlightGraphicLayer.clear();
    	if(btnInfo.state){
    		me.toolbar.activate(esri.toolbars.Draw[btnInfo.drawType]);
    		me.map.setMapCursor("default");
    		me.map.isPan = false;
    		if(btnInfo.radus){
    			me.buffRadus = btnInfo.radus;
    		}
    	}else{
    		me.toolbar.deactivate();
    		me.map.isPan = true;
    	}
    },
    
    searchLayerOnOfffHandler:function(selectInfo){
    	var me = this;
    	me.layers = [];
    	if(selectInfo.length==0){
    		me.targetGraphicLayer.clear();
    		me.highlightGraphicLayer.clear();
    		return;
    	}
    	Ext.each(selectInfo, function(selectObj, index) {
    		
    		
    		
    		
    		if(selectObj.data.layerId && !isNaN(selectObj.data.layerId)){
    			me.layers.push(selectObj);
    		}
    		if(selectInfo.length==index+1){
    			me.spSearch();
    		}
		});
    },
    
    leftTabChangeHandler: function(tabXtype){
    	var me = this;
    	if(tabXtype=='app-west-tab2'){
    		me.sourceGraphicLayer.setVisibility(true);
    		me.targetGraphicLayer.setVisibility(true);
    		me.highlightGraphicLayer.setVisibility(true);
    	}else{
    		me.sourceGraphicLayer.setVisibility(false);
    		me.targetGraphicLayer.setVisibility(false);
    		me.highlightGraphicLayer.setVisibility(false);
    	}
    },
    
    areaSelectHandler: function(info){
    	var me = this;
    	me.sourceGraphicLayer.clear();
		me.targetGraphicLayer.clear();
		me.highlightGraphicLayer.clear();
		
		//var queryTask = new esri.tasks.QueryTask(Sgis.app.arcServiceUrl + "/rest/services/Layer2/MapServer/" + info.layerId);
		var queryTask = new esri.tasks.QueryTask(Sgis.app.arcServiceUrl + "/rest/services/Layer2_new/MapServer/" + info.layerId);
		var query = new esri.tasks.Query();
		query.returnGeometry = true;
		query.outSpatialReference = {"wkid":102100};
		if(info.layerId!=17){
			query.where = "ADM_CD = '" + info.admCd + "'";
		}else{
			query.where = "ADM_CD = " + info.admCd;
		}
		query.outFields = ["*"];
		queryTask.execute(query,  function(results){
			Ext.each(results.features, function(obj, index) {
				obj.setSymbol(me.simpleFillSymbol);
	    		me.sourceGraphicLayer.add(obj);
	    		var extent = esri.geometry.Polygon(obj.geometry).getExtent();
	    		me.map.setExtent(extent, true);
	    		me.geometry = obj.geometry;
	    		me.spSearch();
			});
		});
		dojo.connect(queryTask, "onError", function(err) {
		});
    },
    
    getLayerDisplayFiledInfo:function(callback, scope){
		var me = this;
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/46");
		var query = new esri.tasks.Query();
		query.returnGeometry = false;
		query.where = "1=1";
		query.outFields = ["*"];
		SGIS.loading.execute();
		queryTask.execute(query,  function(results){
			var attr = results.features;
			Ext.each(results.features, function(obj, index) {
				var attr = obj.attributes
				if(!me.layerDisplayFiledInfo[attr.ServiceID]){
					me.layerDisplayFiledInfo[attr.ServiceID] = [];
					me.layerDisplayFiledInfo[attr.ServiceID].push({fnm:"OBJECTID", fid:"OBJECTID", flag:false})
				}
				me.layerDisplayFiledInfo[attr.ServiceID].push({fnm:attr.Grid_NM, fid:attr.Column_NM});
			});
			SGIS.loading.finish();
		});
		dojo.connect(queryTask, "onError", function(err) {
			SGIS.loading.finish();
		});
	},
	
	getLayerBranchFiledInfo:function(callback, scope){
		var me = this;
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/47");
		var query = new esri.tasks.Query();
		query.returnGeometry = false;
		query.where = "1=1";
		query.outFields = ["*"];
		SGIS.loading.execute();
		queryTask.execute(query,  function(results){
			var attr = results.features;
			Ext.each(results.features, function(obj, index) {
				var attr = obj.attributes
				if(!me.layerBranchFiledInfo[attr.ServiceID]){
					me.layerBranchFiledInfo[attr.ServiceID] = [];
					me.layerBranchFiledInfo[attr.ServiceID].push({fnm:"OBJECTID", fid:"OBJECTID", flag:false})
				}
				//me.layerBranchFiledInfo[attr.ServiceID].push({fnm:attr.Grid_NM, fid:attr.Column_NM});
				me.layerBranchFiledInfo[attr.ServiceID].push({fnm:attr.Column_NM, fid:attr.Grid_NM});
			});
			SGIS.loading.finish();
		});
		dojo.connect(queryTask, "onError", function(err) {
			SGIS.loading.finish();
		});
	},
	
	getLayerDetailFiledInfo:function(callback, scope){
		var me = this;
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/48");
		var query = new esri.tasks.Query();
		query.returnGeometry = false;
		query.where = "1=1";
		query.outFields = ["*"];
		SGIS.loading.execute();
		queryTask.execute(query,  function(results){
			var attr = results.features;
			Ext.each(results.features, function(obj, index) {
				var attr = obj.attributes
				if(!me.layerDetailFiledInfo[attr.ServiceID]){
					me.layerDetailFiledInfo[attr.ServiceID] = [];
					me.layerDetailFiledInfo[attr.ServiceID].push({fnm:"OBJECTID", fid:"OBJECTID", flag:false})
				}
				//me.layerDetailFiledInfo[attr.ServiceID].push({fnm:attr.Grid_NM, fid:attr.Column_NM});
				me.layerDetailFiledInfo[attr.ServiceID].push({fnm:attr.Column_NM, fid:attr.Grid_NM});
			});
			SGIS.loading.finish();
		});
		dojo.connect(queryTask, "onError", function(err) {
			SGIS.loading.finish();
		});
	},
	
	getLayerChartFiledInfo:function(callback, scope){
		var me = this;
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/49");
		var query = new esri.tasks.Query();
		query.returnGeometry = false;
		query.where = "1=1";
		query.outFields = ["*"];
		SGIS.loading.execute();
		queryTask.execute(query,  function(results){
			var attr = results.features;
			Ext.each(results.features, function(obj, index) {
				var attr = obj.attributes
				if(!me.layerChartFiledInfo[attr.ServiceID]){
					me.layerChartFiledInfo[attr.ServiceID] = [];
					me.layerChartFiledInfo[attr.ServiceID].push({fnm:"OBJECTID", fid:"OBJECTID", flag:false})
				}
				//me.layerChartFiledInfo[attr.ServiceID].push({fnm:attr.Grid_NM, fid:attr.Column_NM});
				me.layerChartFiledInfo[attr.ServiceID].push({fnm:attr.Column_NM, fid:attr.Grid_NM});
			});
			SGIS.loading.finish();
		});
		dojo.connect(queryTask, "onError", function(err) {
			SGIS.loading.finish();
		});
	},
	
	bufferDisplayAndXY:function(){
		var me = this;
		var params = new esri.tasks.ProjectParameters();
	    params.geometries = [me.geometry];
	    params.outSR = new esri.SpatialReference({wkid: 4326});
	    me.geometryService.project(params, function(result) { 
	    	if(result.length>0){
	    		$('#searchDivNew_x').val(result[0].x);
	    		$('#searchDivNew_y').val(result[0].y);
	    	}
		});
	    
	    var params = new esri.tasks.BufferParameters();
	    params.geometries  = [ me.geometry ];
	    params.distances = [ me.buffRadus*1000 ];
	    params.outSpatialReference = new esri.SpatialReference({wkid:102100});
	    params.bufferSpatialReference = new esri.SpatialReference({wkid:102080});
	    
	    params.unit = esri.tasks.GeometryService.UNIT_METER;
	    me.geometryService.buffer(params, function(result){
	    	if(result.length>0){
	    		me.geometry = result[0];
	    		
	    	
	    		var graphic = new esri.Graphic(me.geometry, me.simpleFillSymbol);
	            me.sourceGraphicLayer.clear();
	            me.sourceGraphicLayer.add(graphic);
	            
	            var symbol = new esri.symbol.PictureMarkerSymbol(Sgis.app.meUrl + './GIS/resources/images/btn_close.png' , 16, 16);
	            var finalRing = me.geometry.rings[0][me.geometry.rings[0].length-1];
	            var point = new esri.geometry.Point(finalRing[0], finalRing[1], new esri.SpatialReference({"wkid":102100}));
	    		point.uuid = dojo.dojox.uuid.generateRandomUuid();
	    		var graphic = new esri.Graphic(point, symbol);
	    		graphic.img = 'btn_close'; 
	    		me.sourceGraphicLayer.add(graphic);
	            
	            Sgis.getApplication().fireEvent('drawComplte', null);
	            me.spSearch();
	            
	    	}
	  	},function(){
	  		Sgis.getApplication().fireEvent('drawComplte', null)
	  	});
	},
    
    spSearch:function(filterObject){
    	var me = this;
    	
    	//console.info(me.sourceGraphicLayer);
		//console.info(me.targetGraphicLayer);
		//console.info(me.highlightGraphicLayer);
		
    	var cmbArea1 = Ext.getCmp("cmbArea1");
    	var cmbArea2 = Ext.getCmp("cmbArea2");
    		
		var view = Ext.getCmp("layerTree2");

		var checkedNodes = view.getView().getChecked();
		
		if(checkedNodes.length > 0){
			
			for(var i = 0; i < checkedNodes.length; i++){
				
				if(checkedNodes[i].data.id == '5'){
					
					if(me.sourceGraphicLayer.graphics == undefined
							|| me.sourceGraphicLayer.graphics.length == 0
							|| (me.sourceGraphicLayer.graphics.length > 0 && me.sourceGraphicLayer.graphics[0].attributes != undefined)){
						
			    		if(cmbArea1.value == null || cmbArea2.value == null || cmbArea2.value == "_cancel_"){
			    			
			    			for(var j = 0; j < me.layers.length; j++){
			    				
			    				if(me.layers[i].id == "5"){
			    					
			    					me.layers.splice(i, 1);
			    					break;
			    				}
			    			}
			    			alert("데이터(지하수 관정정보)수가 많아 시군구 까지 선택 후 데이터를 확인할 수있습니다.");
			    			checkedNodes[i].set("checked", false);
			    			//return;
			    		}
					}
				}
			}
		}
    		
    		/*
		if (me.geometry.rings.length != 1){
			
			for(var i = 0 ; i < me.layers.length ; i++){
				
				if(me.layers[i].id == 5){
	    			var cmbArea2 = Ext.getCmp("cmbArea2");
	    			if(cmbArea2.value == undefined){
	    				var view = Ext.getCmp("layerTree2");
	    				console.info(view.store.byIdMap[5].data.checked);
	    				alert("데이터(지하수 관정정보)수가 많아 시군구 까지 선택 후 데이터를 확인할 수있습니다.");
	    				
	    				console.info(view);
	    				
	    				view.store.byIdMap[5].data.checked = false;
	    				console.info(view.store.byIdMap[5].data.checked);
	    				return;
	    			}
	    		}
				
			}
		}
    	*/
    	
    	
		SGIS.loading.execute();
		me.targetGraphicLayer.clear();
		me.highlightGraphicLayer.clear();
		
		if(me.sourceGraphicLayer.graphics.length==0 || !me.geometry || me.layers.length==0){
			SGIS.loading.finish();
			return;
		}
		
		var exeComplteCnt = 0;
		var receiveComplteCnt = 0;
		var complteData = [];
		Ext.each(me.layers, function(layerInfo, index) {
			if(layerInfo){
				var layer = layerInfo.data
				var filterBool = false;
				if(filterObject && filterObject.layerId==layer.layerId){
					filterBool = true;
				}
				var resultData = {};
				resultData.title = layer.text;
				
				//레이어아이디 추가 (지점이동 기능, 검색결과,포인트 클릭)
				resultData.layerId = layer.layerId;
				
				var datas = [];
				resultData.field = me.layerDisplayFiledInfo[layer.layerId];
				
				resultData.filter = layer.filter;
				resultData.filterCallback = me.spSearch;
				resultData.filterCallbackScope = me;
				
				
				//fiield에 filter넣는 구문 pdj
				/*for(var i=0; i<resultData.filter.length; i++){
					var filter = resultData.filter[i];
					var notMatch = true;
					for(var k=0; k<resultData.field.length; k++){
						for(var key in filter){
							if(key == resultData.field[k].fid){
								notMatch = false;
							}
						}
					}
					if(notMatch){
						resultData.field.push({fid:key, fnm:key})
					}
				}*/
				
				resultData.layerId = layer.layerId;
				resultData.text = layer.text;
				resultData.datas = datas;
				resultData.clickCallback = me.highlightGraphic;
				resultData.clickCallbackScope = me;
				
				var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/" + layer.layerId);
				var query = new esri.tasks.Query();
				query.returnGeometry = true;
				query.outSpatialReference = {"wkid":102100};
				query.geometry = me.geometry;
				if(filterBool){
					query.where = filterObject.where;
				}
				query.outFields = ["*"];
				queryTask.execute(query,  function(results){
					receiveComplteCnt ++;
					if(receiveComplteCnt == me.layers.length){
						SGIS.loading.finish();
					}
					if(results.features.length==0){
						exeComplteCnt++;
						if(resultData.field && resultData.field.length>0){
							complteData.push(resultData);
						}
						if(exeComplteCnt==me.layers.length){
							Sgis.getApplication().fireEvent('searchComplete', complteData);
						}
					}
					else
					{
						Ext.each(results.features, function(obj, index) {
							var pictureMarkerSymbol;
							if(layer=='5'){
								pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(Sgis.app.meUrl + '/' + layer.iconInfo , 12, 12);
							}else{
								pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(Sgis.app.meUrl + '/' + layer.iconInfo , 16, 16);
							}
							obj.setSymbol(pictureMarkerSymbol);
				    		me.targetGraphicLayer.add(obj);
				    		datas.push(obj.attributes);
				    		obj.attributes._layerName_ = layer.text;
				    		obj.attributes._layerId_ = layer.layerId;
				    		if(results.features.length==index+1){
				    			exeComplteCnt++;
				    			if(resultData.field && resultData.field.length>0){
									complteData.push(resultData);
								}
								if(exeComplteCnt==me.layers.length){
									Sgis.getApplication().fireEvent('searchComplete', complteData);
								}
				    		}
						});
					}
					
				});
				dojo.connect(queryTask, "onError", function(err) {
					alert("spSearch : " + err);
				});
			}
		});
	},
	
	dataGridSelectHandler:function(layerId, record){
		var me = this;
		me.highlightGraphicLayer.clear();
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/" + layerId);
		var query = new esri.tasks.Query();
		query.returnGeometry = true;
		query.outSpatialReference = {"wkid":102100};
		query.where = "OBJECTID=" + record.data.OBJECTID;
		query.outFields = ["*"];
		queryTask.execute(query,  function(results){
			var feature = results.features[0];
			feature.geometry.spatialReference = new esri.SpatialReference({wkid:102100});
			me.symbolHighlight(feature);
			me.map.centerAt(esri.geometry.Point(feature.geometry));
		});
		dojo.connect(queryTask, "onError", function(err) {
			alert(err);
		});
	},
	
	searchParamChangeHandler:function(layerId, params){
		var me = this;
		var keys = [];
		for(var key in params){
			if(params[key]!='ALL'){
				keys.push(key);
			}
		}
		
		var reData = [];
		var graphics = me.targetGraphicLayer.graphics
		if(keys.length==0){
			for(var i=0; i<graphics.length; i++){
				var attr = graphics[i].attributes;
				graphics[i].show();
				reData.push(attr);
			}
		}else{
			for(var i=0; i<graphics.length; i++){
				var attr = graphics[i].attributes;
				var addYn = true;
				if(attr._layerId_ == layerId){
					for(var k=0; k<keys.length; k++){
						if(attr[keys[k]] && attr[keys[k]]==params[keys[k]]){
							graphics[i].show();
						}else{
							graphics[i].hide();
							addYn = false;
							break;
						}
					}
				}
				if(addYn){
					reData.push(attr);
				}
			}
		}
		
		Sgis.getApplication().fireEvent('searchParamChangeCallback', reData);
	},
	
	symbolHighlight: function(feature){
		var me = this;
		me.highlightGraphicLayer.show();
		var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(Sgis.app.meUrl + './GIS/resources/images/layerIcon/pin_24x24.png' , 24, 24);
		pictureMarkerSymbol.setOffset(0, 12);
		feature.setSymbol(pictureMarkerSymbol);
		me.highlightGraphicLayer.add(feature);
		
		var i=0;
		var timerId = window.setInterval(function(){
			if(i%2==0){
				me.highlightGraphicLayer.hide();
			}else{
				me.highlightGraphicLayer.show();
			}
			if(i>16){
				me.highlightGraphicLayer.hide();
				window.clearInterval(timerId);
			}
			i++;
		}, 300);
	},
	
	areaAutoDisplayCheck:function(){
		var me = this;
		
		
		var xmin = 999999999;
		var ymin = 999999999;
		var xmax = -999999999;
		var ymax = -999999999;
		
		for(var k=0; k<me.sourceGraphicLayer.graphics.length; k++){
			var feature = me.sourceGraphicLayer.graphics[k];
			if(!feature.geometry){
				continue;
			}
			feature.geometry.spatialReference = new esri.SpatialReference({"wkid":102100});
			var extent = esri.geometry.Polygon(feature.geometry).getExtent();
			if(extent && extent.xmin){
				if(extent.xmin<xmin){
					xmin = extent.xmin;
				}
				if(extent.ymin<ymin){
					ymin = extent.ymin;
				}
				if(extent.xmax>xmax){
					xmax = extent.xmax;
				}
				if(extent.ymax>ymax){
					ymax = extent.ymax;
				}
			}
		}
		if(xmin!=999999999){
			var currExtent = me.map.extent;
			if((xmin < currExtent.xmin && xmax>currExtent.xmax) || (ymin < currExtent.ymin && ymax>currExtent.ymax)){
				$.each(me.sourceGraphicLayer.graphics, function(index, graphic) {
					graphic.setSymbol(me.noneSimpleFillSymbol);
				});
			}else{
				$.each(me.sourceGraphicLayer.graphics, function(index, graphic) {
					graphic.setSymbol(me.simpleFillSymbol);
				});
			}
		}
		// 맵의 단계가 6이거나 6밑으로 내려가면 원래 전체 화면으로 변경 (6이하부터 맵이 안보임)
		if(me.map.getLevel() <= 6  ){
			//me.fullExtentMove(me.fullExtent);
			//Sgis.getApplication().coreMap.fullExtentMove();
			me.map.setLevel(7);
			me.map.centerAt(me.fullExtent.getCenter());
		}
	}
});