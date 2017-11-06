Ext.Loader.setConfig({
	enabled : true,
	paths : {
		'Cmm' : 'app/common'
	}
});

Ext.require(['Sgis.CommonModule']);

/**
* The main application class. An instance of this class is created by app.js when it calls
* Ext.application(). This is the ideal place to handle application launch and initialization
* details.
*/

Ext.define('Sgis.Application', {

	extend: 'Ext.app.Application',

	name: 'Sgis',

	coreMap: null,

	browser: null,
	
	fuckBrowser:false,
	
	meUrl:'http://' + window.location.hostname + ':' + window.location.port + '/',
	memType:window.memType,
//	printUrl:'http://' + window.location.hostname + ':' + window.location.port + '/sgis-war/CustomPrintTask.jsp',
//	proxyUrl:'http://' + window.location.hostname + ':' + window.location.port + '/sgis-war/proxy.jsp',
//	excelDownUrl:'http://' + window.location.hostname + ':' + window.location.port + '/sgis-war/excelDownload.jsp',
	printUrl:'./sgis-war/WebContent/CustomPrintTask.jsp',
	proxyUrl:'./sgis-war/WebContent/proxy.jsp',
	excelDownUrl:'./sgis-war/WebContent/excelDownload.jsp',
	

	stores: [
		'Sgis.store.LayerTreeStore',
		'Sgis.store.Layer2TreeStore',
		'Sgis.store.Area1Store',
		'Sgis.store.Area2Store',
		'Sgis.store.Area3Store',
		'Sgis.store.LayerInfoStore',
		'Sgis.store.ScaleInfoStore'
	],

	views : [
		'Sgis.view.main.Main',
		'Sgis.view.north.North',
		'Sgis.view.west.West',
		//'Sgis.view.east.East',
		'Sgis.view.south.South',
		'Sgis.view.center.Center'
	],

	/*
	 * manifest때문에 적어놈.
	 */
	eventType:[
		'dynamicLayerOnOff',
		'dynamicLayer2OnOff',
		'searchLayerOnOff',
		'searchBtnClick',
		'drawComplte',
		'searchComplete',
		'executeMode',
		'finishMode',
		'abortFinishMode',
		'leftTabChange', 		// 왼쪽에 탭변경시 발생.
		'areaSelect',			// 지역을 선택시 발생.
		'spotChanged',			// 지도의 점을 선택했을 때 발생 
		'searchParamChange',	// 검색 조건을 선택했을 때 발생 
		'searchParamChangeCallback',	// 검색 조건을 선택했을 때 지도에 반여되고 다시 그리드에 데이터를준다. 그리드갱신 
		'dataGridSelect',		// South 데이터 그리드 하나를 선택했을 때 발생
		'mapExtentChange',       //지도의 위치를 변경될때.
		'mapUMDPointChange'     //지도의 위치가 변경될때 중심점에 법정동정보 발생
	],

	launch: function () {
		$('#_loadingDiv_').remove();
		var main = Ext.widget('app-main');
		
		main.add({
			region: 'north',
			xtype : 'app-north'
		});
		
		main.add({
			region: 'west',
			xtype : 'app-west'
		});
		
		/*main.add({
			region: 'east',
			xtype : 'app-east'
		});*/
		
		this.browserCheck();
		
		//khLee test
		Ext.setExtent = function (extent) {
		      //extent.xmin.toFixed(2)
		      var s = "";
		      s = "XMin: "+ extent.xmin + " "
		         +"YMin: " + extent.ymin + " "
		         +"XMax: " + extent.xmax + " "
		         +"YMax: " + extent.ymax;
		      //me = Ext.getCmp('_mapDiv_');
		      //console.info(s);
		      //console.info(extent.getCenter());
		      return;
		      //console.info(Ext.getCmp('app_center_container').activeTab.id)
		      //alert(s);
		      //return;
		      //var me = Ext.getCmp(mapDivId);
		      var tabId = Ext.getCmp('app_center_container').activeTab.id;
		      var me = null;
		      var layerId = "";
		      if(tabId == "nakdong_map"){
		       me = Ext.getCmp('_mapDiv_1');
		       layerId = "DynamicLayer1";
		       // level 9 일때 Center 범위
		          //var stdCenterXmin = 14013047.519494653;
		          //var stdCenterXmax = 14599472.400498245;
		          //var stdCenterYmin = 4139294.3942281883;
		          //var stdCenterYmax = 4411410.214923285;
		          var stdCenterXmin = 12728905.446270483;
		          var stdCenterXmax = 15766818.698435722;
		          var stdCenterYmin = 3409091.461517964;
		          var stdCenterYmax = 5441704.9176768325;
		      }
		      if(tabId == "northhan_map"){
		       me = Ext.getCmp('_mapDiv_2');
		       layerId = "DynamicLayer2";
		       // level 9 일때 Center 범위
		          //var stdCenterXmin = 14051266.033637095;
		          //var stdCenterXmax = 14344478.474139143;
		          //var stdCenterYmin = 4470725.348872494;
		          //var stdCenterYmax = 4606783.259220161;
		       	  var stdCenterXmin = 12728905.446270483;
		          var stdCenterXmax = 15766818.698435722;
		          var stdCenterYmin = 3409091.461517964;
		          var stdCenterYmax = 5441704.9176768325;
		      }
		      
		      if(me.map.getLevel() < me.level){
		       //alert("더 이상 축소 할 수 없습니다.");
		       
		       var activeLayer = me.map.getLayer(layerId);
		       activeLayer.setVisibility(false);
		       
		       var deferred = me.map.setExtent(me.initialExtent, true);
		       deferred.then(function(value){
		        me.map.centerAt(me.initialExtent.getCenter());
		        me.map.setLevel(me.level);
		       });
		       
		       activeLayer.setVisibility(true);
		       
		       return;
		      }
		      
		      if(extent.getCenter().x < stdCenterXmin ||
		         extent.getCenter().x > stdCenterXmax ||
		         extent.getCenter().y < stdCenterYmin ||
		         extent.getCenter().y > stdCenterYmax){
		      /*
		      if(extent.getCenter().x < me.initialExtent.xmin ||
		         extent.getCenter().x > me.initialExtent.xmax ||
		         extent.getCenter().y < me.initialExtent.ymin ||
		         extent.getCenter().y > me.initialExtent.ymax){
		      */
		       alert("영역을 벗어났습니다.");
		       me.map.centerAt(me.preExtent.getCenter());
		       //me.map.setLevel(me.level);
		       //me.map.centerAt(me.initialExtent.getCenter());
		      }
		      else{
		       me.preExtent.xmin = extent.xmin;
		       me.preExtent.ymin = extent.ymin;
		       me.preExtent.xmax = extent.xmax;
		       me.preExtent.ymax = extent.ymax;
		      }
		     }
	},
	
	browserCheck:function(){
		var me = this;
		var _ua = navigator.userAgent;
        var rv = -1;
         
        //IE 11,10,9,8
        var trident = _ua.match(/Trident\/(\d.\d)/i);
        if( trident != null )
        {
            if( trident[1] == "7.0" ) me.browser = "IE" + 11 ;
            if( trident[1] == "6.0" ) me.browser = "IE" + 10;
            if( trident[1] == "5.0" ) me.browser = "IE" + 9;
            if( trident[1] == "4.0" ) {
            	me.browser = "IE" + 8;
            	me.fuckBrowser = true;
            }
        }
         
        //IE 7...
        if( navigator.appName == 'Microsoft Internet Explorer' ) {
        	me.browser = "IE" + 7;
        	me.fuckBrowser = true;
        }
        
        if(me.browser){
        	return;
        }
         
        /*
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if(re.exec(_ua) != null) rv = parseFloat(RegExp.$1);
        if( rv == 7 ) me.browser = "IE" + 7;
        */
         
        //other
        var agt = _ua.toLowerCase();
        if (agt.indexOf("chrome") != -1) me.browser = 'Chrome';
        else if (agt.indexOf("opera") != -1) me.browser = 'Opera'; 
        else if (agt.indexOf("staroffice") != -1) me.browser = 'Star Office'; 
        else if (agt.indexOf("webtv") != -1) me.browser = 'WebTV'; 
        else if (agt.indexOf("beonex") != -1) me.browser = 'Beonex'; 
        else if (agt.indexOf("chimera") != -1) me.browser = 'Chimera'; 
        else if (agt.indexOf("netpositive") != -1) me.browser = 'NetPositive'; 
        else if (agt.indexOf("phoenix") != -1) me.browser = 'Phoenix'; 
        else if (agt.indexOf("firefox") != -1) me.browser = 'Firefox'; 
        else if (agt.indexOf("safari") != -1) me.browser = 'Safari'; 
        else if (agt.indexOf("skipstone") != -1) me.browser = 'SkipStone'; 
        else if (agt.indexOf("netscape") != -1) me.browser = 'Netscape'; 
        else if (agt.indexOf("mozilla/5.0") != -1) me.browser = 'Mozilla';
	}
});