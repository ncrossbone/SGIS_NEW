define(["dojo/_base/declare", "esri/toolbars/draw", "esri/geometry/geometryEngine", 
        "esri/geometry/ScreenPoint", "esri/layers/GraphicsLayer"], function(declare, Draw, geometryEngine, ScreenPoint, GraphicsLayer) {
	return declare("Sgis.map.toolbar.CustomDistance", [Draw], {
		map:null,
		points:null,
		distances:null,
		layer1:null, 
		smpLineSymbol:null,
		constructor : function(map) {
			var me = this;
			me.map = map;
			me.setLineSymbol(new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0,0.2]), 4));
			me.smpLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0,0.6]), 4);
			dojo.connect(me, "onDrawEnd", function(event){
    			me.map.setMapCursor("default");
    			var imageUrl = 'resources/images/dClose.png';
        		var symbol = new esri.symbol.PictureMarkerSymbol(imageUrl , 17, 17);
        		var graphic = new esri.Graphic(me.points[me.points.length-1], symbol);
        		graphic.closeBtn = true;
        		me.map.graphics.add(graphic);
    			me.deactivate();
    		});
			
			dojo.connect(me.map.graphics, "onClick", function(event){
				if(event.graphic.closeBtn){
					me.map.graphics.clear();
					if(me.layer1){
						me.map.removeLayer(me.layer1);
					}
				}
			});
		},
		
		start:function(){
			var me = this;
			me.map.graphics.clear();
			if(me.layer1){
				me.map.removeLayer(me.layer1);
			}
			me.points = [];
			me.distances = [];
			me.activate(esri.toolbars.Draw.POLYLINE);
			me.layer1 = new GraphicsLayer();
			me.map.addLayer(me.layer1);
		},
		
		end:function(){
			
		},
		
		_onClickHandler: function(event) {
			var me = this;
			me.inherited(arguments);	
			
    		var point = me.map.toMap(new ScreenPoint(event.layerX, event.layerY));
    		me.points.push(point);
    		
    		var imageUrl = 'resources/images/dPoint.png';
    		var symbol = new esri.symbol.PictureMarkerSymbol(imageUrl , 12, 12);
    		var graphic2 = new esri.Graphic(point, symbol);
    		me.map.graphics.add(graphic2);
    		if(me.points.length>1){
    			var dis = geometryEngine.distance(me.points[me.points.length-2], me.points[me.points.length-1], 9001)
    			me.distances.push(dis);
    			
    			var currDistances = 0;
    			for(var i=0; i<me.distances.length; i++){
    				currDistances += me.distances[i];
    			}
        		
        		var unit = "m";
    			if(currDistances>1000){
    				currDistances = currDistances/1000;
    				currDistances = currDistances.toFixed(1);
    				unit = "km";
    			}else{
    				currDistances = Math.round(currDistances)
    			}
    			currDistances = currDistances + unit
        		var wid = me.labelFontSize(currDistances);
        		
        		var labelimageUrl = 'resources/images/dLabel.png';
        		var labelsymbol = new esri.symbol.PictureMarkerSymbol(labelimageUrl , wid, 20).setOffset(wid/2+8, -10);
        		var graphic3 = new esri.Graphic(point, labelsymbol);
        		me.map.graphics.add(graphic3);
        		
        		var font = new esri.symbol.Font("12px", esri.symbol.Font.STYLE_NORMAL, esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLDER, 'Nanum Gothic');
        		var tsm = new esri.symbol.TextSymbol(currDistances, font).setOffset(wid/2+8, -15);
	  			tsm.color = new dojo.Color("#ff0000");
        		var graphic4 = new esri.Graphic(point, tsm);
	  			me.map.graphics.add(graphic4);
    		}
    		
    		var polyline = new esri.geometry.Polyline(me.map.spatialReference);
    		console.info(polyline);
    		polyline.addPath([me.points[me.points.length-2], me.points[me.points.length-1]]);
    		var graphic1 = new esri.Graphic(polyline, me.smpLineSymbol);
    		me.layer1.add(graphic1);
		},
		
		_onMouseMoveHandler: function(event) {
			var me = this;
			me.inherited(arguments);	
			var point = me.map.toMap(new ScreenPoint(event.layerX, event.layerY));
			var currDistances = geometryEngine.distance(me.points[me.points.length-1], point, 9001);
			var unit = "m";
			for(var i=0; i<me.distances.length; i++){
				currDistances += me.distances[i];
			}
			if(currDistances>1000){
				currDistances = currDistances/1000;
				currDistances = currDistances.toFixed(1);
				unit = "km";
			}else{
				currDistances = Math.round(currDistances)
			}
			var wid = me.labelFontSize(currDistances + unit);
			var domNode = dojo.query('.tooltip')[0];
			domNode.style.color = "#ff0000";
			domNode.style.width = wid+"px";
			domNode.style['border-color'] = "#ff0000"
			domNode.lastChild.textContent = currDistances + unit;
	    },
	    
	    labelFontSize:function(str){
			var result = 0;
			for(var i=0; i<str.length; i++){
				var chr = str.substring(i, i+1);
				if(isNaN(chr)){
					result += 11;
				}else{
					result += 7;
				}
			}
			return result;
		}
	});
});