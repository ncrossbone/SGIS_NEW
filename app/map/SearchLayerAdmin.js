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
	testCenter:null,
	
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
		
        me.jibunGraphicLayer = new esri.layers.GraphicsLayer();
        me.jibunGraphicLayer.id = "jibunGraphic";
        me.map.addLayer(me.jibunGraphicLayer);

		
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
			
			//내부망 환경일시 클릭 event적용
			//if(location.href.substr(7,3) == "10."){
				if(location.href.substr(7,7) == "/sgisin"){
				var attributes = event.graphic.attributes;
				var layerId = attributes._layerId_;
				
				var storeRecord = Ext.getCmp("layerTree2").store.findRecord('id', layerId);
				//url이 없을시 return;
				/*if(storeRecord.data.linkNum == undefined){
					return;
				}*/
				
				SGIS.popup('Sgis.map.InfoWindow');
				Ext.getCmp('InfoWindowField1').setValue(attributes.PT_NM);
				Ext.getCmp('InfoWindowField2').setValue(attributes.ADDR);
				Ext.getCmp('InfoWindowField3').setValue(attributes.CODE);
				Ext.getCmp('InfoWindowField4').setValue(storeRecord.data.linkNum);
				
				//lineNum가 없을시 이동버튼 hidden
				if(Ext.getCmp('InfoWindowField4').value == undefined){
					Ext.getCmp('InfoWindowFieldButton').setHidden(true);
				}
				Ext.getCmp('InfoWindowIns').setTitle(attributes._layerName_);
			}else{
				return;
			}
			

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
		Sgis.getApplication().addListener('jibunSelect', me.jibunSelectHandler, me);
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
        	me.addDrawGraphic(event);
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
    		me.jibunGraphicLayer.setVisibility(true);
    		me.targetGraphicLayer.setVisibility(true);
    		me.highlightGraphicLayer.setVisibility(true);
    	}else{
    		me.sourceGraphicLayer.setVisibility(false);
    		me.jibunGraphicLayer.setVisibility(false);
    		me.targetGraphicLayer.setVisibility(false);
    		me.highlightGraphicLayer.setVisibility(false);
    	}
    },
    
    areaSelectHandler: function(info){
    	var me = this;
    	me.sourceGraphicLayer.clear();
		me.targetGraphicLayer.clear();
		me.highlightGraphicLayer.clear();
		
		var url = "";
		
		//var queryTask = new esri.tasks.QueryTask(Sgis.app.arcServiceUrl + "/rest/services/Layer2/MapServer/" + info.layerId);
		if(info.layerId == _API.layer1Re ){
			url = _API.layer1_new + "/" + info.layerId;
		}else{
			url = _API.layer2_new + "/" + info.layerId;
		}
		
		var queryTask = new esri.tasks.QueryTask(url);
		var query = new esri.tasks.Query();
		query.returnGeometry = true;
		query.outSpatialReference = {"wkid":102100};
		query.where = "ADM_CD = '" + info.admCd + "'";
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

    /*showBuffer: function (bufferedGeometries) {
    	//esri.symbol.SimpleFillSymbol
    	
    	var me = this;
    	
    	var symbol = new esri.symbol.SimpleFillSymbol(
    			esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(
                		esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                  new dojo.Color([255,0,0,0.65]), 2
                ),
                new dojo.Color([255,0,0,0.35])
              );
    	
    	 var graphic = new esri.Graphic(bufferedGeometries[0], symbol);
         //me.sourceGraphicLayer.clear();
         me.sourceGraphicLayer.add(graphic);
         me.spSearch();
    	
      },*/
    //지번검색 그래픽레이어 설정
    jibunSelectHandler: function(info){
    	var me = this;
    	me.sourceGraphicLayer.clear();
		me.targetGraphicLayer.clear();
		me.highlightGraphicLayer.clear();
    	me.jibunGraphicLayer.clear();
		var queryTask = new esri.tasks.QueryTask(_API.lsmdContLdreg + "/" + info.layerId);
		var query = new esri.tasks.Query();
		query.returnGeometry = true;
		query.outSpatialReference = {"wkid":102100};
		query.where = "PNU = '"+info.PNU+"'";
		query.outFields = ["*"];
		queryTask.execute(query,  function(results){
			Ext.each(results.features, function(obj, index) {
				
				obj.setSymbol(me.simpleFillSymbol);
	    		me.jibunGraphicLayer.add(obj);
				
	    		var btnDistances = "";
	    		
	    		var btnAr  = Ext.getCmp('btnSRHBox').items.items;
	    		var sRradusForm = Ext.getCmp('sRradusVal').value;
	    		Ext.each(btnAr, function(btn, index) {
    				if(btn.pressed){
    					if(index == 3){
    						btnDistances = sRradusForm;
    					}else{
    						btnDistances = btn.value;
    					}
	    				 
	    			}
	    		});
	    		
				var center = esri.geometry.Polygon(obj.geometry).getExtent().getCenter();
				
				me.map.testCenter = esri.geometry.Polygon(obj.geometry).getExtent().getCenter();
	    		me.map.centerAndZoom(center,17);
				
	    		var params = new esri.tasks.BufferParameters();
	            params.distances = [ btnDistances ];
	            params.outSpatialReference = new esri.SpatialReference({wkid:102100});
	            params.unit = esri.tasks.GeometryService.UNIT_METER;
	            
	            require(["esri/geometry/normalizeUtils"], function(normalizeUtils) { 
	            	
	            	normalizeUtils.normalizeCentralMeridian([obj.geometry]).then(function(normalizedGeometries){
		                var normalizedGeometry = normalizedGeometries[0];
		                if (normalizedGeometry.type === "polygon") {	
		                  me.geometryService.simplify([normalizedGeometry], function(geometries) {
		                    params.geometries = geometries;
		                    
		                    me.geometryService.buffer(params, function(result){
		                    	
		                    	if(result.length>0){
		            	    		me.geometry = result[0];
		            	    		var symbol = new esri.symbol.SimpleFillSymbol(
		            	    				esri.symbol.SimpleFillSymbol.STYLE_SOLID,
		            	    	            new esri.symbol.SimpleLineSymbol(
		            	    	            		esri.symbol.SimpleLineSymbol.STYLE_SOLID,
		            	    	              new dojo.Color([255,0,0,0.65]), 2
		            	    	            ),
		            	    	            new dojo.Color([255,0,0,0.35])
		            	    	          );
		            	    		
		            	    		var graphic = new esri.Graphic(me.geometry, symbol);
		            	            me.sourceGraphicLayer.clear();
		            	            me.sourceGraphicLayer.add(graphic);
		            	            me.spSearch();
		            	            
		            	    	}
		                    	
		                    })
		                    
		                  });
		                } else {
		                  params.geometries = [normalizedGeometry];
		                  me.geometryService.buffer(params, showBuffer);
		                }

		              });
	            	
	            });
	            
	            
	    		
	    		
			});
		});
		dojo.connect(queryTask, "onError", function(err) {
		});
    },
    getTargetPoint: function(jibunCenterPoint, jibunPolygon, callback){
		var jibunRings = jibunPolygon.geometry.rings;
		
		var distanceForLong = 0;
		var distParams = new esri.tasks.DistanceParameters();
        distParams.distanceUnit = esri.tasks.GeometryService.UNIT_METER;
        var disExeArr = [];
        var disPointArr = [];
        
		for(var z=0; z<jibunRings.length; z++){
			for(var zz=0; zz<jibunRings[z].length; zz++){
				var desPoint = new esri.geometry.Point(jibunRings[z][zz], new esri.SpatialReference({ wkid: 102100 }));
				
				distParams.geometry1 = jibunCenterPoint;
    	        distParams.geometry2 = desPoint;
    	        distParams.geodesic = false;
    	        
    	        disExeArr.push(this.geometryService.distance(distParams));
    	        disPointArr.push(desPoint);
			}
		}
		var dl = new dojo.DeferredList(disExeArr);

		var desPoint;
		
		dl.then(function(result){
			console.log(result);
			for(var z=0; z<result.length; z++){
				if(parseInt(result[z][1]) > distanceForLong){
					distanceForLong = parseInt(result[z][1]);
					desPoint = disPointArr[z];
				}
			}
			if(callback !=null){
				callback.apply(this, [desPoint, distanceForLong]);
			}
        });
    },
    getLayerDisplayFiledInfo:function(callback, scope){
		var me = this;
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/" + _API.gridDef);
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
			me.layerDisplayFiledInfo[42].push({fnm:"중심점거리", fid:"DISTANCE"});
			me.layerDisplayFiledInfo[5].push({fnm:"중심점거리", fid:"DISTANCE"});
			SGIS.loading.finish();
		});
		dojo.connect(queryTask, "onError", function(err) {
			SGIS.loading.finish();
		});
	},
	
	getLayerBranchFiledInfo:function(callback, scope){
		var me = this;
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/" + _API.infoDef);
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
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/" + _API.infoGridDef);
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
		var queryTask = new esri.tasks.QueryTask(me.layer1Url + "/" + _API.chartdef);
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
	
	bufferDisplayAndPolygon: function(){
		
		var me = this;
		
		
		
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
		
		/*
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
				me.map.centerCount = 0;
				me.map.centerDatas = [];
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
							if(layer.id=='5'){
								pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(Sgis.app.meUrl + '/' + layer.iconInfo , 12, 12);
							}else{
								pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(Sgis.app.meUrl + '/' + layer.iconInfo , 16, 16);
							}
							obj.setSymbol(pictureMarkerSymbol);
							me.targetGraphicLayer.add(obj);
							
							if(layer.layerId == '1' || layer.layerId == '2'){
								obj.attributes.ADDR = obj.attributes.ADDR.replace(/[0-9]/g, "*");
							}else if(layer.layerId == '42' || layer.layerId == '5' ){
								if(me.map.testCenter == undefined || me.map.testCenter == null){
									datas.push(obj.attributes);
										obj.attributes._layerName_ = layer.text;
										obj.attributes._layerId_ = layer.layerId;
										if(results.features.length==index+1){
											exeComplteCnt++;
											if(resultData.field && resultData.field.length>0){
												for(var a = 0 ; a < resultData.field.length;a++){
													if(resultData.field[a].fid == "DISTANCE"){
														resultData.field[a].flag = false;
													}
												}
												complteData.push(resultData);
											}
											if(exeComplteCnt==me.layers.length){
												
												Sgis.getApplication().fireEvent('searchComplete', complteData);
												
											}
										}
								}else{
									var distParams = new esri.tasks.DistanceParameters();  
								 	distParams.distanceUnit = esri.tasks.GeometryService.UNIT_METER;      
								 	distParams.geometry1 =  me.map.testCenter;     
								 	distParams.geometry2 = obj.geometry;
								 	distParams.geodesic = true;  

									me.resultCenterDistance(distParams, function(distance){
										//var distance = Math.floor(distance);
										var distance = distance.toFixed(2);
										obj.attributes.DISTANCE = distance + "(m)";
										datas.push(obj.attributes);
										obj.attributes._layerName_ = layer.text;
										obj.attributes._layerId_ = layer.layerId;
										if(results.features.length==index+1){
											exeComplteCnt++;
											if(resultData.field && resultData.field.length>0){
												for(var a = 0 ; a < resultData.field.length;a++){
													if(resultData.field[a].fid == "DISTANCE"){
														delete resultData.field[a].flag;
													}
												}
												complteData.push(resultData);
											}
											if(exeComplteCnt==me.layers.length){
												Sgis.getApplication().fireEvent('searchComplete', complteData);
												//센터 값 초기화
												me.map.testCenter = null;	
												
											}
										}
									});
								}
								

							}

							if(layer.layerId != '42' && layer.layerId != '5' ){
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

	resultCenterDistance : function(distParams, callback){
		var geometryService = new esri.tasks.GeometryService(_API.arcServerceUrl + "/rest/services/Utilities/Geometry/GeometryServer");  
		geometryService.distance(distParams,callback);
	},
	
	//지번에서 센터점에서 지하수 관정간의 거리
	resultCenterDistance_test : function(distParams , endCount, resultData){
		var me = this;

		var distanceField = [{"fid":"CODE","fnm":"허가신고번호"},{"fid":"DISTANCE","fnm":"거리"}]
		
		var geometryService;  
			geometryService = new esri.tasks.GeometryService(_API.arcServerceUrl + "/rest/services/Utilities/Geometry/GeometryServer");  
			geometryService.distance(distParams,function(distance){  
				
				//me.map.centerDatas
				me.map.centerDatas.push({"CODE":distParams.parameter.attributes.CODE, "DISTANCE":distance});
				me.map.centerCount++;
				if(me.map.centerCount == endCount){
					
					resultData.title = "지하수 관정 거리";
					resultData.layerId = "42_1";
					resultData.text = "지하수 관정 거리";
					resultData.field = distanceField;
					resultData.datas = me.map.centerDatas;
					Sgis.getApplication().fireEvent('searchComplete', [resultData]);
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