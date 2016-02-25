dojo.declare("Sgis.map.toolbar.CustomDraw", esri.toolbars.Draw, {
	drawMode:false,
	closeBtn:false,
	closeEvent:false,
	removeGraphicEvent:false,
	smpLineSymbol:null,
	simpleFillSymbol:null,
	smpLineSymbol2:null,
	simpleFillSymbol2:null,
	
	constructor: function(a, b, closeBtn, layer){
		var me = this;
		if(!layer){
			layer = this.map.graphics;
		}
		if(closeBtn){
			this.closeBtn = closeBtn;
		}
		me.smpLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL, new dojo.Color([20,20,20,1]), 2);
		me.simpleFillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL, me.smpLineSymbol, "#00ff00");
		me.smpLineSymbol2 = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255,0.8]), 2);
		me.simpleFillSymbol2 = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, me.smpLineSymbol2, new dojo.Color([0,0,255,0.1]));
	},
	
	activate: function(a) {
		var me = this;
		this.inherited(arguments);	
		this.drawMode = true;
		if(!me.closeEvent){
			me.closeEvent = dojo.connect(this.map.graphics, "onClick", function(event){
	        	if(me.closeBtn && !this.drawMode && event.graphic.geometry.type=='point' && event.graphic.geometry.uuid){
	        		var removeGraphics = [];
	        		for(var i=0; i<this.graphics.length; i++){
	        			var graphic = this.graphics[i];
	        			if(graphic.geometry && event.graphic.geometry.uuid == graphic.geometry.uuid){
	        				removeGraphics.push(graphic);
	        			}
	        		}
	        		for(var i=0; i<removeGraphics.length; i++){
	        			this.remove(removeGraphics[i]);
	        		}
	        	}
			});
		}
		if(me.removeGraphicEvent){
			dojo.disconnect(me.removeGraphicEvent);
		}
	},
	
	deactivate:function(){
		var me = this;
		this.inherited(arguments);	
		this.drawMode = false;
		me.removeGraphicEvent = dojo.connect(this.map.graphics, "onGraphicRemove", function(event){
        	var removeGraphics = [];
    		for(var i=0; i<this.graphics.length; i++){
    			var graphic = this.graphics[i];
    			if(graphic.geometry && event.geometry.uuid == graphic.geometry.uuid){
    				removeGraphics.push(graphic);
    			}
    		}
    		for(var i=0; i<removeGraphics.length; i++){
    			this.remove(removeGraphics[i]);
    		}
		});
	},
	
	_onMouseMoveHandler: function(a) {
		this.inherited(arguments);	
		var me = this;
        if(this._geometryType == "polygon") {
            this._graphic.setSymbol(me.simpleFillSymbol);
            var one = this._points[0];
            
            for(var i=0; i<this.map.graphics.graphics.length; i++){
    			var graphic = this.map.graphics.graphics[i];
    			if(graphic.attributes && graphic.attributes.id && graphic.attributes.id=="fucker"){
    				this.map.graphics.remove(graphic);
    				break;
    			}
    		}

            var fPolygon = new esri.geometry.Polygon(this._graphic.geometry.toJson()); //this._graphic.geometry.toJson();
            fPolygon.insertPoint(0, this._points.length, a.mapPoint);
            var fuckGraphic = new esri.Graphic(fPolygon, me.simpleFillSymbol2);
            fuckGraphic.attributes = {id:"fucker"};
    		this.map.graphics.add(fuckGraphic);
    	}
    },
    
    _onClickHandler: function(a) {
    	this.inherited(arguments);
    	if(this._geometryType == "polygon") {
    		for(var i=0; i<this.map.graphics.graphics.length; i++){
     			var graphic = this.map.graphics.graphics[i];
     			if(graphic.attributes && graphic.attributes.id && graphic.attributes.id=="fucker"){
     				this.map.graphics.remove(graphic);
     				break;
     			}
     		}
    	}
    },
    
    _drawEnd: function(geo) {
    	var uuid = dojo.dojox.uuid.generateRandomUuid();
    	geo.uuid = uuid;
    	this.inherited(arguments);	
    	for(var i=0; i<this.map.graphics.graphics.length; i++){
 			var graphic = this.map.graphics.graphics[i];
 			if(graphic.attributes && graphic.attributes.id && graphic.attributes.id=="fucker"){
 				this.map.graphics.remove(graphic);
 				break;
 			}
 		}
    	/*
    	if(this.closeBtn && geo.type == "polygon") {
    		geo.uuid = uuid;
    		
    		var closeBool = false;
    		for(var i=0; i<this.map.graphics.graphics.length; i++){
    			var geometry = this.map.graphics.graphics[i].geometry;
    			if(uuid == geometry.uuid){
    				closeBool = true;
    			}
    		}
        	
    		if(closeBool){
    			var imageUrl = 'resources/images/btn_close.png';
        		var symbol = new esri.symbol.PictureMarkerSymbol(imageUrl , 16, 16);
            	var finalRing = geo.rings[0][geo.rings[0].length-1];
        		var point = new esri.geometry.Point(finalRing[0], finalRing[1], new esri.SpatialReference(_etcConfig.spatialReferenceInfo));
        		point.uuid = uuid;
        		var graphic = new esri.Graphic(point, symbol);
        		layer.add(graphic);
    		}
    	}
    	*/
    }
});