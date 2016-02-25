/**
* MeasureWindow Controller
*/
Ext.define('Sgis.view.north.MeasureWindowController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-measurewindow',

	control: {	
		'#areaBtn': {
			click: 'areaBtnClick'
		},
		'#lengthBtn': {
			click: 'lengthBtnClick'
		},
		'#pointBtn': {
			click: 'pointBtnClick'
		}
	},
	
	areaBtnClick:function(){
		var me = this;
		var areaUnit = Ext.getCmp('areaUnit');
		Ext.getCmp('areaResult').setText('');
		Sgis.getApplication().coreMap.areaMeasureReady(areaUnit.selection.data.value, me.areaMeasureCallback, me);
	},
	
	areaMeasureCallback:function(result){
		Ext.getCmp('areaResult').setText(result.areas[0]);
	},
	
	lengthBtnClick:function(){
		var me = this;
		var lengthUnit = Ext.getCmp('lengthUnit');
		Ext.getCmp('lengthResult').setText('');
		
		var trident = navigator.userAgent.match(/Trident\/(\d.\d)/i);
		/*if(trident != null){
			if(!Sgis.app.customDistance){
    			Sgis.app.customDistance = new Sgis.map.toolbar.CustomDistance(Sgis.app.coreMap.map);
    		}
        }else{//IE가 아닌 다른 브라우져
        	console.info(lengthUnit.selection);
        	Sgis.getApplication().coreMap.lengthMeasureReady(lengthUnit.selection.data.value, me.lengthMeasureCallback, me);
        }*/
		Sgis.getApplication().coreMap.lengthMeasureReady(lengthUnit.selection.data.value, me.lengthMeasureCallback, me);
		if(!Sgis.app.customDistance){
			Sgis.app.customDistance = new Sgis.map.toolbar.CustomDistance(Sgis.app.coreMap.map);
		}
		Sgis.app.customDistance.start();
	},
	
	lengthMeasureCallback:function(result){
		Ext.getCmp('lengthResult').setText(result.lengths[0]);
	},
	
	pointBtnClick:function(){
		var me = this;
		var pointUnit = Ext.getCmp('pointUnit');
		Ext.getCmp('pointResult1').setText('');
		Ext.getCmp('pointResult2').setText('');
		Sgis.getApplication().coreMap.pointMeasureReady(pointUnit.selection.data.value, me.pointMeasureCallback, me);
	},
	
	pointMeasureCallback:function(result, unit){
		var me = this;
		if(unit=='dms'){
			Ext.getCmp('pointResult1').setText("경도:" + me.dmsDisplay(result[0].x));
			Ext.getCmp('pointResult2').setText("위도:" + me.dmsDisplay(result[0].y));
		}else{
			Ext.getCmp('pointResult1').setText("경도:" + (result[0].x+"").substring(0,8));
			Ext.getCmp('pointResult2').setText("위도:" + (result[0].y+"").substring(0,8));
		}
		
	},
	
	dmsDisplay:function(degree){
		var str = degree +'';
		var strArr = str.split('.');
		var doVal = strArr[0];
		var miVal = Number('0.' + strArr[1]) * 60;
		
		var seVal = Number('0.' + strArr[1].substring(4)) * 60;
		//console.log(degree + "  " + doVal + "도 " + miVal + "분 " + seVal + "초");
		return doVal + "도 " + Math.round(miVal) + "분 " + Math.round(seVal) + "초"
	}
});