Ext.define('Sgis.map.CoreMap', {
	extend: 'Ext.Component',
	xtype: 'app-map-coreMap',
	requires: [
	   	    'Sgis.map.DynamicLayerAdmin',
	   	    'Sgis.map.SearchLayerAdmin'
	],
	
	//html: "<div id='_mapDiv_' style='height:100%; width:100%;background-color: #ffffff;'></div>",
	html: "<div id='_mapDiv_' style='position:relative; height:100%; width:100%;background-color: #94b7d4;'></div>" +
		  "<div style='position:absolute; top:5%; left:93%; width:60px; height:200px;'>" +
		  "<div class='zoomText'>" +
		  	"<div style='top:75px; background: url(./resources/images/zoom.png) -216px 0px;'></div>" +
		  	"<div style='top:95px; background: url(./resources/images/zoom.png) -245px 0px;'></div>" +
		  	"<div style='top:115px; background: url(./resources/images/zoom.png) -274px 0px;'></div>" +
		  	"<div style='top:135px; background: url(./resources/images/zoom.png) -303px 0px;'></div>" +
		  "</div>" +
		  "<div class='plus' style='position:absolute; top:0px; left:30px; width: 20px; height: 20px; background: url(./resources/images/zoom.png) -80px 0px no-repeat;'></div>" +
		  "<div class='zoomBar' style='top:20px; left:30px; border: solid 1px; margin-left:1px; padding-top:1px; position: absolute; width: 18px; height: 121px; background: url(./resources/images/zoom.png) -140px 0px repeat-y; transition: height 0.1s;'></div>" +
		  "<div class='zoomBar2' style='top:141px; left:30px; border: solid 1px; margin-left:1px; padding-top:1px; position: absolute; width: 18px; height: 11px; background: url(./resources/images/zoom.png) -122px 0px repeat-y; transition: height 0.1s;'></div>" +
		  "<div class='zoomPart'>" +
		  	"<div style='top: 25px;'></div>" +
		  	"<div style='top: 35px;'></div>" +
		  	"<div style='top: 45px;'></div>" +
		  	"<div style='top: 55px;'></div>" +
		  	"<div style='top: 65px;'></div>" +
		  	"<div style='top: 75px;'></div>" +
		  	"<div style='top: 85px;'></div>" +
		  	"<div style='top: 95px;'></div>" +
		  	"<div style='top: 105px;'></div>" +
		  	"<div style='top: 115px;'></div>" +
		  	"<div style='top: 125px;'></div>" +
		  	"<div style='top: 135px;'></div>" +
		  	"<div style='top: 145px;'></div>" +
		  "</div>" +
		  "<div class='zoomPartClick'>" +
		  	"<div class='zoomPartClick_1' style='top: 21px;'></div>" +
		  	"<div class='zoomPartClick_2' style='top: 31px;'></div>" +
		  	"<div class='zoomPartClick_3' style='top: 41px;'></div>" +
		  	"<div class='zoomPartClick_4' style='top: 51px;'></div>" +
		  	"<div class='zoomPartClick_5' style='top: 61px;'></div>" +
		  	"<div class='zoomPartClick_6'style='top: 71px;'></div>" +
		  	"<div class='zoomPartClick_7' style='top: 81px;'></div>" +
		  	"<div class='zoomPartClick_8' style='top: 91px;'></div>" +
		  	"<div class='zoomPartClick_9' style='top: 101px;'></div>" +
		  	"<div class='zoomPartClick_10' style='top: 111px;'></div>" +
		  	"<div class='zoomPartClick_11' style='top: 121px;'></div>" +
		  	"<div class='zoomPartClick_12' style='top: 131px;'></div>" +
		  	"<div class='zoomPartClick_13' style='top: 141px;'></div>" +
		  "</div>" +
		  "<div class='zoomPointer' style='overflow: hidden; position: absolute; margin: -5px 0px 0px; width: 18px; height: 11px; background: url(./resources/images/zoom.png) -157px 0px; transition: top 0.1s; left: 31px; top: 135px;'></div>" +
		  "<div class='minus' style='top:141px; left:30px; position: absolute; width: 20px; height: 20px; background: url(./resources/images/zoom.png) -100px 0px no-repeat;'></div>" +
		  "</div>",
	
	map:null,
	dynamicLayerAdmin:null,
	geometryService:null,
	unit:null,
	measureCallback:null,
	measureScope:null,
	smpLineSymbol:null, 
	simpleFillSymbol:null,
	fullExtent:null,
	extentReg:[],
	extentRegAble:true,
	extentUnReIdx:0,
	printTask:null,
	backAndWhite:false,
	
	dynamicLayerAdmin:null,
	searchLayerAdmin:null,
	
	onRender: function(){
		this.callParent(arguments);
		this.mapRendered();
	},
	
	layerInfo:null,
	
	mapRendered: function(p){
        var me = this;
        
        //IE10일때 CustomDreaw처리
        var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);
        var customDraw = "";
        var customPrintTask = "";
        var customDistance = "";

  				customDraw = "/GIS/app/map/toolbar/CustomDraw.js";
        	customPrintTask = "/GIS/app/map/task/CustomPrintTask.js";
        	customDistance = "/GIS/app/map/toolbar/CustomDistance.js";
  
        
        
        me.layerInfo = {'layer1Url':Sgis.app.arcServiceUrl2 + '/rest/services/Layer1_new/MapServer',
        				'layer2Url':Sgis.app.arcServiceUrl  + '/rest/services/Layer2_new/MapServer'};
        
        require(["dojo/dom",
  		         "dojo/dom-attr",
  		         "dojo/_base/array",
  		         "esri/Color",
  		         "dojo/number",
  		         "dojo/parser",
  		         "dijit/registry",
  		         "esri/config",
  		         "esri/map",
  		         "esri/graphic",
  		         "esri/tasks/GeometryService",
  		         "esri/tasks/BufferParameters",
  		         "esri/toolbars/draw",
  		         "esri/symbols/SimpleMarkerSymbol",
  		         "esri/symbols/SimpleLineSymbol",
  		         "esri/symbols/SimpleFillSymbol",
  		         "esri/symbols/PictureMarkerSymbol",
  		         "esri/symbols/Font",
  		         "esri/symbols/TextSymbol",
  		         "esri/tasks/AreasAndLengthsParameters",
  		         "esri/tasks/LengthsParameters",
  		         "dijit/layout/BorderContainer",
  		         "dijit/layout/ContentPane",
  		         "dojox/uuid/generateRandomUuid",
  		         "esri/tasks/ProjectParameters",
  		         customDraw,
  		         customPrintTask,
  		         customDistance],  
  		         function() {
		        	esri.config.defaults.io.proxyUrl = Sgis.app.proxyUrl;
		    		esri.config.defaults.io.alwaysUseProxy = true;
		    		esri.config.defaults.io.postLength = 1;
		    		Ext.defer(function() {
	    				me.map = new esri.Map('_mapDiv_', {
			        		isDoubleClickZoom:false,
			    	     	isPan:true,
			    	 		logo:false,
			    	 		//slider: true,
			    	 		slider: false,
			    	 		autoResize: true
			    	 		
			        	});

			        	me.baseMapInit();
			        	me.map.setLevel(1+6);
			        	me.geometryService = new esri.tasks.GeometryService(Sgis.app.arcServiceUrl + "/rest/services/Utilities/Geometry/GeometryServer");
			        	Ext.Loader.loadScript({url:'/GIS/app/map/toolbar/CustomDraw.js', onLoad:function(){
			        		me.dynamicLayerAdmin = Ext.create('Sgis.map.DynamicLayerAdmin', me.map);
			        		me.searchLayerAdmin = Ext.create('Sgis.map.SearchLayerAdmin', me.map, me.geometryService);
			        		me.toolbar = new Sgis.map.toolbar.CustomDraw(me.map, {showTooltips:false}, true, me.map.graphics);
				        	dojo.connect(me.toolbar, "onDrawEnd", function(event){
				    			me.map.setMapCursor("default");
				    			me.measure(event);
				    		});
			        	}, onError:function(){}});
			        	
			        	Ext.Loader.loadScript({url:'/GIS/app/map/task/CustomPrintTask.js', onLoad:function(){
			        		me.printTask = new Sgis.map.task.CustomPrintTask(me.map, "_mapDiv_", Sgis.app.printUrl, Sgis.app.arcServiceUrl);
			        		dojo.connect(me.printTask, "onComplete", function(event){	
			        			SGIS.loading.finish();
			        		});
			        	}, onError:function(){}});
			        	
			        	// khLee Extent Change Event
			            dojo.connect(me.map, "onExtentChange", Ext.setExtent);
			        	
			        	me.smpLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255,0.8]), 2);
			    		me.simpleFillSymbol= new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, me.smpLineSymbol, new dojo.Color([0,0,255,0.1]));
			    		me.mapEventDefine()
			        	Sgis.getApplication().coreMap = me;
		    		}, 1, this);
		        	
        });
    },
    
    _zoomPointerTop:0,
    _zoomBar:0,
    _zoomBar2:0,
    _maxTop : 0,
    _minTop : 0,
    _plusValue : 10,
    _minusValue : 0,
    preValue: 0,
    
    mapEventDefine:function(){
    	var me = this;

    	me._zoomPointerTop = parseInt($(".zoomPointer").css("top"));
    	me._maxTop = me._zoomPointerTop;
    	me._minTop = me._maxTop - 110;

    	me._zoomBar = parseInt($(".zoomBar").height());
    	me._zoomBar2 = parseInt($(".zoomBar2").height());

    	$(".minus").click(function(){
    		var topPx = $(".zoomPointer").css("top");
    		var pxSplit = parseInt(topPx.split('px')[0]);
    		var cnt = 0;
    		var calc = pxSplit + 10;

    		if(pxSplit < me._maxTop){
    			$(".zoomPointer").css("top",calc);
    			cnt++;
    			me.topCalc(cnt);
    			me.zoomEvent(calc);
    		}
    	});
    	

    	$(".plus").click(function(){

    		var topPx = $(".zoomPointer").css("top");
    		var pxSplit = parseInt(topPx.split('px')[0]);
    		var cnt = 0;
    		var calc = pxSplit - 10;

    		if(pxSplit>me._minTop){
    			$(".zoomPointer").css("top",calc);
    			me.topCalc(cnt);
    			me.zoomEvent(calc);
    		}
    	});
    	
    	$(".zoomPartClick div").click(function(){
    		
    		var className = $(this).context.className;
    		var calc = 0;
    		var val = 0;
    		switch (className) {
    		case "zoomPartClick_1":
    			val = 100;
    			calc = me._minTop;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_2":
    			val = 80;
    			calc = me._minTop + 10;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_3":
    			val = 60;
    			calc = me._minTop + 20;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_4":
    			val = 40;
    			calc = me._minTop + 30;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_5":
    			val = 20;
    			calc = me._minTop + 40;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_6":
    			val = 0;
    			calc = me._minTop + 50;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_7":
    			val = -20;
    			calc = me._minTop + 60;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_8":
    			val = -40;
    			calc = me._minTop + 70;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_9":
    			val = -60;
    			calc = me._minTop + 80;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_10":
    			val = -80;
    			calc = me._minTop + 90;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_11":
    			val = -100;
    			calc = me._minTop + 100;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_12":
    			val = -120;
    			calc = me._minTop + 110;
    			$(".zoomPointer").css("top",calc);
    			break;
    		case "zoomPartClick_13":
    			calc = me._minTop + 120;
    			$(".zoomPointer").css("top",calc);
    			break;
			default:
				break;
			}
    		$(".zoomBar2").height(calc + val);
			$(".zoomBar2").css("top",calc);
    		me.zoomEvent(calc);
    	});

    	$(".minus").mouseover(function(){
    		$('.minus').css( 'cursor', 'pointer' );
    	});

    	$(".plus").mouseover(function(){
    		$('.plus').css( 'cursor', 'pointer' );
    	});
    	
    	$(".zoomPartClick div").mouseover(function(){
    		$(this).css( 'cursor', 'pointer' );
    	});
    	
    	
    	
    	me.map.on("mouse-wheel", function(a){

    		var currValue = Math.round(a.timeStamp)/1000;

    		if(me.preValue!=currValue){
    			var calcValue = currValue - me.preValue;
    			var toFixedValue = parseFloat(calcValue.toFixed(1));
    			if(toFixedValue >= 0.2){
    				if(a.value == 1){
    					$('.plus').trigger('click');
    				}else{
    					$(".minus").trigger('click');
    				}
    			};
    		}

    		me.preValue = currValue;
    	});

    	dojo.connect(this.map, "onExtentChange", function(extent){
    		me.currUmdInfo();
    		if(me.extentRegAble){
    			if(me.extentReg.length>30){
    				me.extentReg.splice(0, 1);
    			}
    			me.extentReg.push(extent);
    			me.extentUnReIdx = me.extentReg.length-1;
    		}
    		me.extentRegAble = true;
    		Sgis.getApplication().fireEvent('mapExtentChange', event);
    	});
    },
    
    topCalc: function(cnt){
    	var me = this;
    	var topPx = $(".zoomPointer").css("top");
    	var pxSplit = parseInt(topPx.split('px')[0]);
    	var calc = me._zoomPointerTop - pxSplit;

    		if(cnt!=0){
    			var nowZoombar = $(".zoomBar2").css("top");
    			var splitZoombar = parseInt(nowZoombar.split("px")[0]);
    			me._minusValue = splitZoombar + 10;
    			$(".zoomBar2").height(me._zoomBar2 + calc - 10);
    			$(".zoomBar2").css("top",me._minusValue);
    		}else{
    			var nowZoombar = $(".zoomBar2").css("top");
    			var splitZoombar = parseInt(nowZoombar.split("px")[0]);
    			me._plusValue = splitZoombar - 10;
    			$(".zoomBar2").height(me._zoomBar2 + calc + 10);
    			$(".zoomBar2").css("top",me._plusValue);
    		}

    	
    	
    },
    
    zoomEvent: function(level){
    	var me = this;
    
    	switch (level) {
		case me._maxTop:
			me.map.setLevel(7);
			break;
		case me._maxTop - 10:
			me.map.setLevel(8);
			break;
		case me._maxTop - 20:
			me.map.setLevel(9);
			break;
		case me._maxTop - 30:
			me.map.setLevel(10);
			break;
		case me._maxTop - 40:
			me.map.setLevel(11);
			break;
		case me._maxTop - 50:
			me.map.setLevel(12);
			break;
		case me._maxTop - 60:
			me.map.setLevel(13);
			break;
		case me._maxTop - 70:
			me.map.setLevel(14);
			break;
		case me._maxTop - 80:
			me.map.setLevel(15);
			break;
		case me._maxTop - 90:
			me.map.setLevel(16);
			break;
		case me._maxTop - 100:
			me.map.setLevel(17);
			break;
		case me._maxTop - 110:
			me.map.setLevel(18);
			break;

		default:
			break;
		}
    },
    
    baseMapInit: function(){
		var me = this;
		dojo.declare('CustomMapsLayer', esri.layers.TiledMapServiceLayer, {
		    constructor: function(opts) {
		      opts = opts || {};
		      this.spatialReference = new esri.SpatialReference({wkid: 102100});
		      this.tileInfo = new esri.layers.TileInfo({
		        rows: 256, cols: 256, dpi: 96,
		        origin: {x: -20037508.342787, y: 20037508.342787},
		        spatialReference: {wkid: 102100},
		        lods: [
						{level:0, resolution:156543.033928,    scale:591657527.591555},
						{level:1, resolution:78271.5169639999, scale:295828763.795777},
						{level:2, resolution:39135.7584820001, scale:147914381.897889},
						{level:3, resolution:19567.8792409999, scale:73957190.948944},
						{level:4, resolution:9783.93962049996, scale:36978595.474472},
						{level:5, resolution:4891.96981024998, scale:18489297.737236},
						{level:6, resolution:2445.98490512499, scale:9244648.868618},
						{level:7, resolution:1222.99245256249, scale:4622324.434309}, //start
						{level:8, resolution:611.49622628138,  scale:2311162.217155},
						{level:9, resolution:305.748113140558, scale:1155581.108577},
						{level:10,resolution:152.874056570411, scale:577790.554289},
						{level:11,resolution:76.4370282850732, scale:288895.277144},
						{level:12,resolution:38.2185141425366, scale:144447.638572},
						{level:13,resolution:19.1092570712683, scale:72223.819286},
						{level:14,resolution:9.55462853563415, scale:36111.909643},
						{level:15,resolution:4.77731426794937, scale:18055.954822},
						{level:16,resolution:2.38865713397468, scale:9027.977411},
						{level:17,resolution:1.19432856685505, scale:4513.988705},
						{level:18,resolution:0.597164283559817,scale:2256.994353}
						//{level:19,resolution:0.298582141647617,scale:1128.497176}
		          ]
		      });
		      me.fullExtent = this.fullExtent = new esri.geometry.Extent({
		    	  xmin: 12728905.446270483,
		    	  ymin: 3409091.461517964,
		    	  xmax: 15766818.698435722,
		    	  ymax: 5441704.9176768325,
		          spatialReference: {
		        	  wkid: 102100
		          }
		      });
		      this.initialExtent = new esri.geometry.Extent({
		    	  xmin: 12728905.446270483,
		    	  ymin: 3409091.461517964,
		    	  xmax: 15766818.698435722,
		    	  ymax: 5441704.9176768325,
		          spatialReference: {
		        	  wkid: 102100
		          }
		      });
		      this.loaded = true;
		      this.onLoad(this);
		    },
		    getTileUrl: function(level, row, col) {
		    	var newrow = row + (Math.pow(2, level) * 47);
      			var newcol = col + (Math.pow(2, level) * 107);
		    	return esri.config.defaults.io.proxyUrl + "?http://xdworld.vworld.kr:8080/2d/Base/201301/" + level + "/" + col + "/" + row + ".png";
		    	//return "http://112.218.1.243:20080/2d/Base/201411/" + level + "/" + level + "/" + col + "/" + row + ".png";
		    }	
		  });
		var baseMap = new CustomMapsLayer();
		this.map.addLayer(baseMap);
	},
	
	mapResize:function(){
		var me  = this;
		if(this.map){
			var xmin = this.map.extent.xmin;
			var ymin = this.map.extent.ymin;
			var xmax = this.map.extent.xmax;
			var ymax = this.map.extent.ymax;
			var extent = new esri.geometry.Extent(xmin, ymin, xmax, ymax, new esri.SpatialReference({wkid: 102100}));
			var handler = dojo.connect(this.map, "onExtentChange", function(eve){
				me.map.centerAt(extent.getCenter());
				dojo.disconnect(handler);  
			});
			this.map.resize();	
		}
	},
	
	areaMeasureReady:function(unit, callback, scope){
		var me = this;
		me.map.graphics.clear();
		me.unit = unit;
		me.measureCallback = callback;
		me.measureScope = scope;
		me.toolbar.activate('polygon');
		me.map.setMapCursor("default");
		me.map.isPan = false;
	},
	
	lengthMeasureReady:function(unit, callback, scope){
		var me = this;
		me.map.graphics.clear();
		me.unit = unit;
		me.measureCallback = callback;
		me.measureScope = scope;
		me.toolbar.activate('polyline');
		me.map.setMapCursor("default");
		me.map.isPan = false;
	},
	
	pointMeasureReady:function(unit, callback, scope){
		var me = this;
		me.map.graphics.clear();
		me.unit = unit;
		me.measureCallback = callback;
		me.measureScope = scope;
		me.toolbar.activate('point');
		me.map.setMapCursor("default");
		me.map.isPan = false;
	},
	
	measure:function(event){
		var me = this;
		me.toolbar.deactivate();
		me.map.isPan = true;
		
		dojo.connect(me.map.graphics, "onClick", function(event){
        	if(event.graphic.img && event.graphic.img =='btn_close' && event.graphic.geometry.uuid){
        		me.map.graphics.clear();
        	}
		});
		
		var symbol = new esri.symbol.PictureMarkerSymbol('/GIS/resources/images/btn_close.png' , 16, 16);
        var point = null;
        if(event.type=='polygon'){
        	var finalRing = event.rings[0][event.rings[0].length-1];
    		point = new esri.geometry.Point(finalRing[0], finalRing[1], new esri.SpatialReference({"wkid":102100}));
    		
    		var polygon = new esri.geometry.Polygon(event);
    		var graphic = new esri.Graphic(polygon, me.simpleFillSymbol);
    		me.map.graphics.add(graphic);
    		
    		var params = new esri.tasks.AreasAndLengthsParameters();
		    params.polygons  = [ polygon ];
		    params.areaUnit = esri.tasks.GeometryService[me.unit]
		    me.geometryService.areasAndLengths(params, function(result){
		    	me.measureCallback.apply(me.measureScope, [result]);
		  	});
    		
        }else if(event.type=='polyline'){
    		point = new esri.geometry.Point(event.paths[0][0][0], event.paths[0][0][1], new esri.SpatialReference({"wkid":102100}));
    		var polyline = new esri.geometry.Polyline(event);
    		var graphic = new esri.Graphic(polyline, me.smpLineSymbol);
    		
    		me.map.graphics.add(graphic);
    		var params = new esri.tasks.LengthsParameters();
		    params.polylines  = [ polyline ];
		    params.lengthUnit = esri.tasks.GeometryService[me.unit]
		    
		    me.geometryService.lengths(params, function(result){
		    	me.measureCallback.apply(me.measureScope, [result]);
		  	});
        }else if(event.type=='point'){
        	var params = new esri.tasks.ProjectParameters();
    	    params.geometries = [event];
    	    params.outSR = new esri.SpatialReference({wkid: 4326});
    	    me.geometryService.project(params, function(result) { 
    	    	me.measureCallback.apply(me.measureScope, [result, me.unit]);
    		});
    		point = event;
        }
        
		point.uuid = dojo.dojox.uuid.generateRandomUuid();
		var delGraphic = new esri.Graphic(point, symbol);
		delGraphic.img = 'btn_close'; 
		me.map.graphics.add(delGraphic);
	},
	
	timer:null,
	timerUUID:null,
	
	baseMapGrayCall:function(){
		var me = this;
		if(me.backAndWhite && Sgis.getApplication().browser!='Chrome' && Sgis.getApplication().browser!='Opera'){
			if(me.timer){
				window.clearInterval(me.timer);
			}	
			me.timer = window.setInterval(function(){
				me.timerUUID= dojo.dojox.uuid.generateRandomUuid();
				var imgs = Ext.query('.layerTile');
				for(var i=0; i<imgs.length; i++){
					var res = me.grayImage(imgs[i], me.timerUUID+"");
					if(!res){
						window.clearInterval(me.timer);
						return;
					}else{
						imgs[i].src = res;
					}
				}
				window.clearInterval(me.timer);
			}, 100);
		}
	},
	
	baseMapGray:function(mode){
		var me = this;
		me.backAndWhite = mode;
		if(Sgis.getApplication().browser=='Chrome' || Sgis.getApplication().browser=='Opera'){
			if(mode){
				document.getElementById("_mapDiv__layer0").style['-webkit-filter']="grayscale(100%)";
			}else{
				document.getElementById("_mapDiv__layer0").style['-webkit-filter']="";
			}
		}else{
			if(mode){
				var imgs = Ext.query('.layerTile');
				for(var i=0; i<imgs.length; i++){
					imgs[i].src = me.grayImage(imgs[i]);
				}
			}else{
				var level = me.map.getLevel();
				var deferred = me.map.setLevel(1);
				deferred.then(function(value){
					me.map.setLevel(level);
				},function(error){
				});
			}
		}
	},
	
	fullExtentMove:function(){
		var me = this;
		var deferred = me.map.setExtent(me.fullExtent, true);
		deferred.then(function(value){
			me.map.setLevel(1+6);
		},function(error){
		});
	},
	
	grayImage:function(imgObj, callUUID){
		var me = this;
		if(callUUID!=me.timerUUID){
			return false;
		}
		var canvas = document.createElement('canvas');
	    var canvasContext = canvas.getContext('2d');
	    var imgW = imgObj.width;
	    var imgH = imgObj.height;
	    canvas.width = imgW;
	    canvas.height = imgH;
	     
	    canvasContext.drawImage(imgObj, 0, 0);
	    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
	     
	    for(var y = 0; y < imgPixels.height; y++){
	        for(var x = 0; x < imgPixels.width; x++){
	            var i = (y * 4) * imgPixels.width + x * 4;
	            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
	            imgPixels.data[i] = avg; 
	            imgPixels.data[i + 1] = avg; 
	            imgPixels.data[i + 2] = avg;
	        }
	    }
	    
	    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
	    return canvas.toDataURL();
	},
	
	prevExtentMove:function(){
		var me = this;
		me.extentRegAble = false;
		me.extentUnReIdx--;
		if(me.extentUnReIdx > -1){
			me.map.setExtent(me.extentReg[me.extentUnReIdx], true);
		}else{
			me.extentUnReIdx == 0;
		}
	},
	
	nextExtentMove:function(){
		var me = this;
		me.extentRegAble = false;
		me.extentUnReIdx++;
		if(me.extentUnReIdx < me.extentReg.length){
			me.map.setExtent(me.extentReg[me.extentUnReIdx], true);
		}else{
			me.extentUnReIdx = me.extentReg.length - 1;
		}
	},
	
	print:function(){
		var me = this;
		me.printTask.print();
		SGIS.loading.execute();
	},
	
	capture:function(){
		var me = this;
		me.printTask.capture();
		SGIS.loading.execute();
	},
	
	getLayerDisplayFiledInfo:function(){
		var me = this;
		return me.searchLayerAdmin.layerDisplayFiledInfo;
	},
	
	getLayerBranchFiledInfo:function(){
		var me = this;
		return me.searchLayerAdmin.layerBranchFiledInfo;
	},
	
	getLayerDetailFiledInfo:function(){
		var me = this;
		return me.searchLayerAdmin.layerDetailFiledInfo;
	},
	
	getLayerChartFiledInfo:function(){
		var me = this;
		return me.searchLayerAdmin.layerChartFiledInfo;
	},
	
	currUmdMarker:null,
	
	currUmdInfo:function(){
		var me = this;
		var extent = me.map.extent
		var x = (me.map.extent.xmin+me.map.extent.xmax)/2;
		var y = (me.map.extent.ymin+me.map.extent.ymax)/2;
		me.currUmdMarker = dojo.dojox.uuid.generateRandomUuid();
		
		//var queryTask = new esri.tasks.QueryTask(Sgis.app.arcServiceUrl + "/rest/services/Layer2/MapServer/24");
		var queryTask = new esri.tasks.QueryTask(Sgis.app.arcServiceUrl + "/rest/services/Layer2_new/MapServer/17");
		var query = new esri.tasks.Query();
		query.currUmdMarker = me.currUmdMarker;
		query.returnGeometry = false;
		query.outSpatialReference = {"wkid":102100};
		query.geometry = new esri.geometry.Point(x, y, new esri.SpatialReference({wkid:102100}));
		query.outFields = ["ADM_CD, DO_NM, CTY_NM, DONG_NM"];
		queryTask.execute(query,  function(results){
			if(results.features.length>0 && query.currUmdMarker == me.currUmdMarker){
				var attr = results.features[0].attributes
				//console.log(attr.DO_NM + " " + attr.CTY_NM + " " + attr.DONG_NM);
				Sgis.getApplication().fireEvent('mapUMDPointChange', attr);
			}
		});
		dojo.connect(queryTask, "onError", function(err) {
		});
	}
});