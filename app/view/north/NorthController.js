/**
* North Controller
*/
Ext.define('Sgis.view.north.NorthController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-north',

	control: {
		'#mapmode': {
			change: 'onMapModeChange'
		}
	},
	
	requires: [ 
		'Sgis.view.north.measure.MeasureWindow'
	],
	
	constructor: function(map) {
		var me = this;
		me.callParent();
		Sgis.getApplication().addListener('mapExtentChange', me.mapExtentChangeHandler, me);
		Sgis.getApplication().addListener('mapUMDPointChange', me.mapUMDPointChangeHandler, me);
    },
	
	onClickAll: function () {
		Sgis.getApplication().coreMap.fullExtentMove();
	},
	
	onClickPrev: function () {
		Sgis.getApplication().coreMap.prevExtentMove()
	},
	
	onClickNext: function () {
		Sgis.getApplication().coreMap.nextExtentMove();
	},
	
	onClickMeasure: function (button, e) {
		
		var measurewindowPop = Ext.getCmp("measurewindowPop");
		var measureWindow = Ext.create("Sgis.view.north.measure.MeasureWindow", null, {modal:false, x:e.pageX-30, y:e.pageY+20});
		if(measurewindowPop != undefined){
			measurewindowPop.close();
		}else{
			measureWindow.show();
		}
		
		
		
	},
	
	onClickPrint: function () {
		Sgis.getApplication().coreMap.print();
	},
	
	onClickSave: function () {
		Sgis.getApplication().coreMap.capture();
	},
	
	onClickGray: function (button) {
		Sgis.getApplication().coreMap.baseMapGray(button.pressed);
	},

	onClickMapMode: function (button, e) {
		SGIS.msg.alert('맵 모드 ' + button.text + ' Clicked!');
	},
	
	onMapModeChange: function(button, item, eOpts) {
		SGIS.msg.alert('맵 모드 ' + button.text + ' Clicked!');
	},
	
	onClickSetting: function() {
		var content = Ext.getCmp('content');
		var layout = content.getLayout();
		layout.setActiveItem(1);
	},
	
	mapExtentChangeHandler:function(){
		if(Sgis.getApplication().browser!='Chrome' && Sgis.getApplication().browser!='Opera'){
			Ext.getCmp('grayBtn').setPressed(false);
		}
	},
	
	mapUMDPointChangeHandler:function(attr){
		Ext.getCmp('currUmdLabel').setText(attr.DO_NM + " " + attr.CTY_NM + " " + attr.DONG_NM)
	}
});
